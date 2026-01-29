import { useState, useEffect } from 'react';
import { getSupabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Square, Download, Video, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { startRealVideoRecording, stopRealVideoRecording, isVideoRecording } from '@/utils/realVideoRecorder';

interface ScreenRecording {
  id: string;
  session_id: string;
  user_id: string | null;
  file_path: string;
  duration: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export function RealVideoRecorder() {
  const [recordings, setRecordings] = useState<ScreenRecording[]>([]);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecordings();
    setupRealTimeSubscription();
    
    // Check if recording is already active
    setIsRecordingActive(isVideoRecording());
  }, []);

  const loadRecordings = async () => {
    try {
      const supabase = await getSupabase();
      
      const { data } = await supabase
        .from('screen_recordings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setRecordings(data);
    } catch (error) {
      console.error('Error loading recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeSubscription = async () => {
    const supabase = await getSupabase();
    
    supabase
      .channel('screen_recordings_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'screen_recordings'
      }, (payload) => {
        setRecordings(prev => [payload.new as ScreenRecording, ...prev.slice(0, 49)]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'screen_recordings'
      }, (payload) => {
        setRecordings(prev => prev.map(recording => 
          recording.id === payload.new.id ? payload.new as ScreenRecording : recording
        ));
      })
      .subscribe();
  };

  const handleStartRecording = async () => {
    const sessionId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    toast.info('Requesting screen recording permission...');
    
    const success = await startRealVideoRecording(sessionId);
    
    if (success) {
      setIsRecordingActive(true);
      setCurrentSessionId(sessionId);
      toast.success('Screen recording started!');
    } else {
      toast.error('Failed to start recording. Permission denied or not supported.');
    }
  };

  const handleStopRecording = () => {
    stopRealVideoRecording();
    setIsRecordingActive(false);
    setCurrentSessionId(null);
    toast.success('Recording stopped and saved!');
  };

  const getVideoUrl = async (filePath: string): Promise<string> => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.storage
        .from('screen-recordings')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error getting video URL:', error);
      return '';
    }
  };

  const downloadRecording = async (recording: ScreenRecording) => {
    try {
      const url = await getVideoUrl(recording.file_path);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `recording_${recording.session_id}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started!');
      } else {
        toast.error('Failed to get download URL');
      }
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast.error('Download failed');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading video recordings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Real Video Recording</h1>
        <div className="flex items-center gap-2">
          {isRecordingActive && (
            <Badge variant="destructive" className="animate-pulse">
              <Video className="h-3 w-3 mr-1" />
              Recording
            </Badge>
          )}
        </div>
      </div>

      {/* Permission Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">Permission Required</p>
              <p className="text-yellow-700">
                Real video recording requires explicit browser permission to capture your screen. 
                This cannot be done silently due to security restrictions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Recording Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {!isRecordingActive ? (
              <Button
                onClick={handleStartRecording}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Start Screen Recording
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            {isRecordingActive && currentSessionId && (
              <div className="text-sm text-muted-foreground">
                Recording session: {currentSessionId.slice(-8)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recorded Sessions ({recordings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {recordings.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No recordings yet. Start your first recording above!
                </div>
              ) : (
                recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {recording.session_id.slice(-8)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(recording.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatDuration(recording.duration)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadRecording(recording)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {recording.file_path && (
                      <VideoPlayer filePath={recording.file_path} />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Video player component
function VideoPlayer({ filePath }: { filePath: string }) {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase.storage
          .from('screen-recordings')
          .createSignedUrl(filePath, 3600);
        
        if (data?.signedUrl) {
          setVideoUrl(data.signedUrl);
        }
      } catch (error) {
        console.error('Error loading video:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVideo();
  }, [filePath]);
  
  if (loading) {
    return (
      <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading video...</div>
      </div>
    );
  }
  
  if (!videoUrl) {
    return (
      <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Video unavailable</div>
      </div>
    );
  }
  
  return (
    <video 
      src={videoUrl} 
      controls 
      className="w-full max-h-64 rounded border"
      preload="metadata"
    >
      Your browser does not support video playback.
    </video>
  );
}