import html2canvas from 'html2canvas';
import { getSupabase } from '@/integrations/supabase/client';

interface VideoFrame {
  timestamp: number;
  blob: Blob;
  filename: string;
}

export class ScreenshotVideoRecorder {
  private sessionId: string;
  private isRecording = false;
  private frames: VideoFrame[] = [];
  private captureInterval?: NodeJS.Timeout;
  private uploadInterval?: NodeJS.Timeout;
  private frameRate = 5; // 5 FPS for smooth video
  private captureQuality = 0.6;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async startRecording(options?: { frameRate?: number; quality?: number }) {
    if (this.isRecording) return false;
    
    this.frameRate = options?.frameRate || 5;
    this.captureQuality = options?.quality || 0.6;
    this.isRecording = true;
    this.frames = [];
    
    console.log(`Starting screenshot video recording at ${this.frameRate} FPS`);
    
    // Create session record
    await this.createSessionRecord();
    
    // Start capturing frames
    this.captureInterval = setInterval(() => {
      this.captureFrame();
    }, 1000 / this.frameRate);
    
    // Upload frames every 30 seconds to prevent memory issues
    this.uploadInterval = setInterval(() => {
      this.uploadFramesBatch();
    }, 30000);
    
    return true;
  }

  private async createSessionRecord() {
    try {
      const supabase = await getSupabase();
      
      await supabase
        .from('video_sessions')
        .insert({
          session_id: this.sessionId,
          page_url: window.location.href,
          start_time: new Date().toISOString(),
          frame_rate: this.frameRate,
          status: 'recording'
        });
    } catch (error) {
      console.error('Error creating video session record:', error);
    }
  }

  private async captureFrame() {
    if (!this.isRecording) return;
    
    try {
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scale: 0.4, // Smaller scale for better performance
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#ffffff'
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', this.captureQuality);
      });

      if (blob) {
        const timestamp = Date.now();
        const filename = `${this.sessionId}_frame_${timestamp}.jpg`;
        
        this.frames.push({
          timestamp,
          blob,
          filename
        });

        // Keep only last 150 frames in memory (30 seconds at 5 FPS)
        if (this.frames.length > 150) {
          this.frames = this.frames.slice(-150);
        }
      }
    } catch (error) {
      console.warn('Frame capture failed:', error);
    }
  }

  private async uploadFramesBatch() {
    if (this.frames.length === 0) return;
    
    const framesToUpload = [...this.frames];
    this.frames = []; // Clear frames after copying
    
    try {
      const supabase = await getSupabase();
      
      // Upload all frames in parallel
      const uploadPromises = framesToUpload.map(frame => 
        supabase.storage
          .from('video-frames')
          .upload(frame.filename, frame.blob, {
            cacheControl: '3600',
            upsert: false
          })
      );
      
      await Promise.allSettled(uploadPromises);
      
      // Update session with frame count
      await supabase
        .from('video_sessions')
        .update({
          frame_count: framesToUpload.length,
          last_activity: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);
        
      console.log(`Uploaded ${framesToUpload.length} video frames`);
    } catch (error) {
      console.error('Error uploading frames:', error);
      // Re-add frames to queue for retry
      this.frames.unshift(...framesToUpload);
    }
  }

  async stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
    }
    
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
    }
    
    // Upload any remaining frames
    await this.uploadFramesBatch();
    
    // Update session status
    try {
      const supabase = await getSupabase();
      await supabase
        .from('video_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.error('Error updating session status:', error);
    }
    
    console.log('Screenshot video recording stopped');
  }

  async generateVideo(): Promise<string | null> {
    try {
      // This would require a backend service to combine frames into video
      // For now, we'll return a placeholder
      console.log('Video generation would happen on backend');
      return `video_${this.sessionId}.mp4`;
    } catch (error) {
      console.error('Error generating video:', error);
      return null;
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  getFrameCount(): number {
    return this.frames.length;
  }
}

// Global recorder instance
let globalVideoRecorder: ScreenshotVideoRecorder | null = null;

export async function startScreenshotVideo(sessionId: string, options?: { frameRate?: number; quality?: number }): Promise<boolean> {
  if (globalVideoRecorder?.isCurrentlyRecording()) {
    console.log('Screenshot video recording already in progress');
    return false;
  }

  globalVideoRecorder = new ScreenshotVideoRecorder(sessionId);
  return await globalVideoRecorder.startRecording(options);
}

export async function stopScreenshotVideo(): Promise<void> {
  if (globalVideoRecorder) {
    await globalVideoRecorder.stopRecording();
    globalVideoRecorder = null;
  }
}

export function isScreenshotVideoRecording(): boolean {
  return globalVideoRecorder?.isCurrentlyRecording() || false;
}

export async function generateVideoFromFrames(): Promise<string | null> {
  if (globalVideoRecorder) {
    return await globalVideoRecorder.generateVideo();
  }
  return null;
}
