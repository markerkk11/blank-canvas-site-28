import { useState, useEffect, useRef } from 'react';
import { getSupabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Play, Download, Eye } from 'lucide-react';

interface SessionRecording {
  id: string;
  session_id: string;
  user_id: string | null;
  start_time: string;
  last_activity: string;
  page_url: string;
  events_data: Record<string, any>;
  event_count: number;
  created_at: string;
}

interface SessionEvent {
  type: string;
  timestamp: number;
  screenshot?: string;
  element?: string;
  coordinates?: { x: number; y: number };
  metadata?: Record<string, any>;
}

export function SessionRecordingsViewer() {
  const [recordings, setRecordings] = useState<SessionRecording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<SessionRecording | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [allEvents, setAllEvents] = useState<SessionEvent[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    loadRecordings();
    setupRealTimeSubscription();
  }, []);

  const loadRecordings = async () => {
    try {
      const supabase = await getSupabase();
      
      const { data } = await supabase
        .from('session_recordings')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(50);

      if (data) setRecordings(data);
    } catch (error) {
      console.error('Error loading recordings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeSubscription = async () => {
    const supabase = await getSupabase();
    
    supabase
      .channel('session_recordings_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_recordings'
      }, (payload) => {
        setRecordings(prev => [payload.new as SessionRecording, ...prev.slice(0, 49)]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'session_recordings'
      }, (payload) => {
        setRecordings(prev => prev.map(recording => 
          recording.id === payload.new.id ? payload.new as SessionRecording : recording
        ));
      })
      .subscribe();
  };

  const selectRecording = (recording: SessionRecording) => {
    setSelectedRecording(recording);
    setCurrentEventIndex(0);
    setIsPlaying(false);
    isPlayingRef.current = false;
    
    // Extract events from the new data structure
    let events: SessionEvent[] = [];
    
    // Check if events are stored in the new format (events_data.events)
    if (recording.events_data?.events && Array.isArray(recording.events_data.events)) {
      events = recording.events_data.events;
    } else {
      // Fallback for old format - flatten all event batches
      Object.values(recording.events_data || {}).forEach((eventBatch: any) => {
        if (Array.isArray(eventBatch)) {
          events.push(...eventBatch);
        }
      });
    }
    
    // Sort events by timestamp
    events.sort((a, b) => a.timestamp - b.timestamp);
    setAllEvents(events);
  };

  const playRecording = () => {
    if (!selectedRecording || allEvents.length === 0) return;
    
    isPlayingRef.current = true;
    setIsPlaying(true);
    playNextEvent();
  };

  const playNextEvent = () => {
    if (currentEventIndex >= allEvents.length - 1) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }
    
    const currentEvent = allEvents[currentEventIndex];
    const nextEvent = allEvents[currentEventIndex + 1];
    
    if (nextEvent) {
      const delay = Math.min(nextEvent.timestamp - currentEvent.timestamp, 3000); // Max 3s between events
      setTimeout(() => {
        setCurrentEventIndex(prev => prev + 1);
        if (isPlayingRef.current) playNextEvent();
      }, delay);
    }
  };

  const getScreenshotUrl = async (fileName: string): Promise<string> => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.storage
        .from('session-recordings')
        .createSignedUrl(fileName, 3600); // 1 hour expiry
      
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error getting screenshot URL:', error);
      return '';
    }
  };

  const formatDuration = (start: string, end: string): string => {
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading session recordings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Visual Session Recordings</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          Recording Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recordings List */}
        <Card>
          <CardHeader>
            <CardTitle>Session Recordings ({recordings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRecording?.id === recording.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => selectRecording(recording)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {recording.session_id.slice(-8)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(recording.start_time)}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div><strong>Page:</strong> {recording.page_url}</div>
                      <div><strong>Events:</strong> {recording.event_count}</div>
                      <div><strong>Duration:</strong> {formatDuration(recording.start_time, recording.last_activity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Session Player */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Session Replay
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRecording ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={playRecording}
                    disabled={isPlaying || allEvents.length === 0}
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {isPlaying ? 'Playing...' : 'Play Session'}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Event {currentEventIndex + 1} of {allEvents.length}
                  </span>
                </div>

                {/* Current Event Display */}
                {allEvents[currentEventIndex] && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>{allEvents[currentEventIndex].type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(allEvents[currentEventIndex].timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {allEvents[currentEventIndex].element && (
                      <div className="text-sm">
                        <strong>Element:</strong> {allEvents[currentEventIndex].element}
                      </div>
                    )}
                    
                    {allEvents[currentEventIndex].coordinates && (
                      <div className="text-sm">
                        <strong>Position:</strong> ({allEvents[currentEventIndex].coordinates!.x}, {allEvents[currentEventIndex].coordinates!.y})
                      </div>
                    )}
                    
                    {allEvents[currentEventIndex].screenshot && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-2">Screenshot:</p>
                        <ScreenshotViewer fileName={allEvents[currentEventIndex].screenshot!} />
                      </div>
                    )}
                  </div>
                )}

                {/* Event Timeline */}
                <div className="space-y-2">
                  <h4 className="font-medium">Event Timeline:</h4>
                  <ScrollArea className="h-40 border rounded p-2">
                    <div className="space-y-1">
                      {allEvents.slice(0, 20).map((event, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 text-xs p-1 rounded ${
                            index === currentEventIndex ? 'bg-primary/20' : ''
                          }`}
                        >
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a session recording to view replay
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screenshot viewer component
function ScreenshotViewer({ fileName }: { fileName: string }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase.storage
          .from('session-recordings')
          .createSignedUrl(fileName, 3600);
        
        if (data?.signedUrl) {
          setImageUrl(data.signedUrl);
        }
      } catch (error) {
        console.error('Error loading screenshot:', error);
      }
    };
    
    loadImage();
  }, [fileName]);
  
  if (!imageUrl) {
    return <div className="w-full h-32 bg-muted rounded flex items-center justify-center text-sm">Loading...</div>;
  }
  
  return (
    <img 
      src={imageUrl} 
      alt="Session screenshot" 
      className="w-full max-h-64 object-contain border rounded"
    />
  );
}