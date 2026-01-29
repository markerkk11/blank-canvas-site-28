import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Download, Play, Clock, Monitor } from 'lucide-react';

interface ScreenRecording {
  id: string;
  session_id: string;
  file_path: string;
  duration: number;
  created_at: string;
  user_id?: string;
}

interface VideoSession {
  id: string;
  session_id: string;
  page_url: string;
  start_time: string;
  end_time?: string;
  frame_rate: number;
  frame_count: number;
  status: string;
}

interface SessionRecording {
  id: string;
  session_id: string;
  page_url: string;
  start_time: string;
  event_count: number;
  events_data: any;
}

export function AllVideosViewer() {
  const [screenRecordings, setScreenRecordings] = useState<ScreenRecording[]>([]);
  const [videoSessions, setVideoSessions] = useState<VideoSession[]>([]);
  const [sessionRecordings, setSessionRecordings] = useState<SessionRecording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllRecordings();
  }, []);

  const loadAllRecordings = async () => {
    try {
      const supabase = await getSupabase();

      // Load screen recordings (real video with permissions)
      const { data: screenData } = await supabase
        .from('screen_recordings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Load video sessions (screenshot-based videos)
      const { data: videoData } = await supabase
        .from('video_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Load session recordings (visual replays)
      const { data: sessionData } = await supabase
        .from('session_recordings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setScreenRecordings(screenData || []);
      setVideoSessions(videoData || []);
      setSessionRecordings(sessionData || []);
    } catch (error) {
      console.error('Error loading recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async (filePath: string, sessionId: string) => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.storage
        .from('screen-recordings')
        .createSignedUrl(filePath, 3600);

      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = `recording_${sessionId}.webm`;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Video className="h-5 w-5" />
        <h2 className="text-2xl font-bold">All Video Recordings</h2>
      </div>

      <Tabs defaultValue="screen" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screen" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Screen Videos ({screenRecordings.length})
          </TabsTrigger>
          <TabsTrigger value="screenshots" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Screenshot Videos ({videoSessions.length})
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Session Replays ({sessionRecordings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="screen" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Real screen recordings captured with user permission
          </div>
          {screenRecordings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No screen recordings found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {screenRecordings.map((recording) => (
                <Card key={recording.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Session: {recording.session_id.slice(0, 8)}...
                      </CardTitle>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(recording.duration)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(recording.created_at)}
                      </div>
                      <Button
                        onClick={() => downloadVideo(recording.file_path, recording.session_id)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="screenshots" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Videos created from automatic screenshots (no permissions needed)
          </div>
          {videoSessions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No screenshot videos found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {videoSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Session: {session.session_id.slice(0, 8)}...
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={session.status === 'recording' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        <Badge variant="outline">
                          {session.frame_count} frames
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>URL:</strong> {session.page_url}
                      </div>
                      <div className="text-sm">
                        <strong>Frame Rate:</strong> {session.frame_rate} FPS
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(session.start_time)}
                        </div>
                        <Button size="sm" variant="outline" disabled>
                          <Play className="h-4 w-4 mr-2" />
                          Generate Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Interactive session replays with user interactions
          </div>
          {sessionRecordings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No session recordings found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sessionRecordings.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Session: {session.session_id.slice(0, 8)}...
                      </CardTitle>
                      <Badge variant="outline">
                        {session.event_count} events
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>URL:</strong> {session.page_url}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(session.start_time)}
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Play Replay
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}