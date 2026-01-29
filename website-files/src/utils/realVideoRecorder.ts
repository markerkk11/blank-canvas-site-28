import { getSupabase } from '@/integrations/supabase/client';

interface VideoRecordingSession {
  sessionId: string;
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  stream: MediaStream | null;
  isRecording: boolean;
  startTime: number;
}

class RealVideoRecorder {
  private session: VideoRecordingSession | null = null;
  private uploadQueue: Blob[] = [];

  async startRecording(sessionId: string): Promise<boolean> {
    try {
      console.log('Requesting screen capture permission...');
      
      // Request screen capture permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Check if user granted permission
      if (!stream) {
        console.log('Screen capture permission denied');
        return false;
      }

      console.log('Screen capture permission granted, starting recording...');

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality
        audioBitsPerSecond: 128000   // 128 kbps for audio
      });

      this.session = {
        sessionId,
        mediaRecorder,
        recordedChunks: [],
        stream,
        isRecording: true,
        startTime: Date.now()
      };

      // Handle recording events
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.session!.recordedChunks.push(event.data);
          
          // Auto-upload chunks every 30 seconds to prevent memory issues
          if (this.session!.recordedChunks.length >= 30) {
            this.uploadChunk();
          }
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped, uploading final chunk...');
        this.uploadFinalChunk();
      };

      // Handle user stopping the share
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('User ended screen share');
        this.stopRecording();
      });

      // Start recording with 1 second chunks
      mediaRecorder.start(1000);

      // Create session record in database
      await this.createSessionRecord(sessionId);

      return true;
    } catch (error) {
      console.error('Error starting video recording:', error);
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          console.log('User denied screen capture permission');
        } else if (error.name === 'NotSupportedError') {
          console.log('Screen capture not supported in this browser');
        }
      }
      
      return false;
    }
  }

  private async createSessionRecord(sessionId: string) {
    try {
      const supabase = await getSupabase();
      
      await supabase
        .from('screen_recordings')
        .insert([{
          session_id: sessionId,
          user_id: null, // Could be enhanced for authenticated users
          file_path: '', // Will be updated when chunks are uploaded
          duration: 0,
          mime_type: 'video/webm'
        }]);
    } catch (error) {
      console.error('Error creating session record:', error);
    }
  }

  private async uploadChunk() {
    if (!this.session || this.session.recordedChunks.length === 0) return;

    try {
      const chunks = [...this.session.recordedChunks];
      this.session.recordedChunks = []; // Clear chunks after copying

      const blob = new Blob(chunks, { type: 'video/webm' });
      const fileName = `${this.session.sessionId}_${Date.now()}_chunk.webm`;
      
      const supabase = await getSupabase();
      
      const { error } = await supabase.storage
        .from('screen-recordings')
        .upload(fileName, blob);

      if (!error) {
        console.log(`Uploaded chunk: ${fileName}`);
        
        // Update session record with new chunk
        await supabase
          .from('screen_recordings')
          .update({
            file_path: fileName, // Store latest chunk path
            duration: Math.floor((Date.now() - this.session.startTime) / 1000),
            updated_at: new Date().toISOString()
          })
          .eq('session_id', this.session.sessionId);
      } else {
        console.error('Error uploading chunk:', error);
        // Re-add chunks to queue for retry
        this.session.recordedChunks.unshift(...chunks);
      }
    } catch (error) {
      console.error('Error in uploadChunk:', error);
    }
  }

  private async uploadFinalChunk() {
    if (!this.session) return;

    // Upload any remaining chunks
    if (this.session.recordedChunks.length > 0) {
      await this.uploadChunk();
    }

    // Create final consolidated video if needed
    const supabase = await getSupabase();
    
    try {
      await supabase
        .from('screen_recordings')
        .update({
          duration: Math.floor((Date.now() - this.session.startTime) / 1000),
          updated_at: new Date().toISOString()
        })
        .eq('session_id', this.session.sessionId);
    } catch (error) {
      console.error('Error updating final record:', error);
    }
  }

  stopRecording(): void {
    if (!this.session || !this.session.isRecording) return;

    console.log('Stopping video recording...');

    try {
      // Stop MediaRecorder
      if (this.session.mediaRecorder && this.session.mediaRecorder.state !== 'inactive') {
        this.session.mediaRecorder.stop();
      }

      // Stop all tracks
      if (this.session.stream) {
        this.session.stream.getTracks().forEach(track => track.stop());
      }

      this.session.isRecording = false;
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  isCurrentlyRecording(): boolean {
    return this.session?.isRecording || false;
  }

  getCurrentSessionId(): string | null {
    return this.session?.sessionId || null;
  }
}

// Global recorder instance
let globalVideoRecorder: RealVideoRecorder | null = null;

export async function startRealVideoRecording(sessionId: string): Promise<boolean> {
  if (globalVideoRecorder?.isCurrentlyRecording()) {
    console.log('Recording already in progress');
    return false;
  }

  globalVideoRecorder = new RealVideoRecorder();
  return await globalVideoRecorder.startRecording(sessionId);
}

export function stopRealVideoRecording(): void {
  if (globalVideoRecorder) {
    globalVideoRecorder.stopRecording();
    globalVideoRecorder = null;
  }
}

export function isVideoRecording(): boolean {
  return globalVideoRecorder?.isCurrentlyRecording() || false;
}

export function getCurrentVideoSession(): string | null {
  return globalVideoRecorder?.getCurrentSessionId() || null;
}