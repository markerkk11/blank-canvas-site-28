import { useState, useEffect } from 'react';
import { getSupabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserSession {
  id: string;
  session_id: string;
  user_id: string | null;
  start_time: string;
  end_time: string | null;
  page_url: string;
  user_agent: string;
  screen_resolution: string;
  created_at: string;
}

interface UserInteraction {
  id: string;
  session_id: string;
  interaction_type: string;
  element_selector: string | null;
  element_text: string | null;
  page_url: string;
  coordinates: { x: number; y: number } | null;
  metadata: Record<string, any>;
  timestamp_ms: number;
  created_at: string;
}

export function SilentSessionDashboard() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    setupRealTimeSubscriptions();
  }, []);

  const loadData = async () => {
    try {
      const supabase = await getSupabase();
      
      // Load recent sessions
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Load recent interactions
      const { data: interactionData } = await supabase
        .from('user_interactions')
        .select('*')
        .order('timestamp_ms', { ascending: false })
        .limit(200);

      if (sessionData) setSessions(sessionData);
      if (interactionData) setInteractions(interactionData);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeSubscriptions = async () => {
    const supabase = await getSupabase();
    
    // Subscribe to new sessions
    supabase
      .channel('user_sessions_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_sessions'
      }, (payload) => {
        setSessions(prev => [payload.new as UserSession, ...prev.slice(0, 49)]);
      })
      .subscribe();

    // Subscribe to new interactions
    supabase
      .channel('user_interactions_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_interactions'
      }, (payload) => {
        setInteractions(prev => [payload.new as UserInteraction, ...prev.slice(0, 199)]);
      })
      .subscribe();
  };

  const getInteractionColor = (type: string): string => {
    const colors: Record<string, string> = {
      click: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      mousemove: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
      scroll: 'bg-green-500/10 text-green-700 border-green-500/20',
      keypress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      focus: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      blur: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      form_submit: 'bg-red-500/10 text-red-700 border-red-500/20',
      page_load_complete: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-700 border-gray-500/20';
  };

  const formatTime = (timestamp: string | number): string => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getSessionInteractions = (sessionId: string) => {
    return interactions.filter(interaction => interaction.session_id === sessionId);
  };

  const getSessionStats = () => {
    const activeSessions = sessions.filter(s => !s.end_time).length;
    const totalInteractions = interactions.length;
    const uniquePages = new Set(sessions.map(s => s.page_url)).size;
    
    return { activeSessions, totalInteractions, uniquePages };
  };

  const stats = getSessionStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Silent User Tracking Dashboard</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          Live Tracking Active
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInteractions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniquePages}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">User Sessions</TabsTrigger>
          <TabsTrigger value="interactions">Live Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const sessionInteractions = getSessionInteractions(session.session_id);
                    const isActive = !session.end_time;
                    
                    return (
                      <div
                        key={session.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSessionId === session.session_id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedSessionId(
                          selectedSessionId === session.session_id ? null : session.session_id
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? "Active" : "Ended"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {session.session_id.slice(-8)}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(session.start_time)}
                          </span>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <div><strong>Page:</strong> {session.page_url}</div>
                          <div><strong>Screen:</strong> {session.screen_resolution}</div>
                          <div><strong>Interactions:</strong> {sessionInteractions.length}</div>
                        </div>

                        {selectedSessionId === session.session_id && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">Session Interactions:</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {sessionInteractions.map((interaction) => (
                                <div key={interaction.id} className="flex items-center gap-2 text-sm">
                                  <Badge className={getInteractionColor(interaction.interaction_type)}>
                                    {interaction.interaction_type}
                                  </Badge>
                                  {interaction.element_selector && (
                                    <span className="text-muted-foreground">
                                      {interaction.element_selector}
                                    </span>
                                  )}
                                  {interaction.element_text && (
                                    <span className="text-xs bg-muted px-1 rounded">
                                      "{interaction.element_text.slice(0, 30)}..."
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {formatTime(interaction.timestamp_ms)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live User Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="flex items-center gap-3 p-3 border rounded">
                      <Badge className={getInteractionColor(interaction.interaction_type)}>
                        {interaction.interaction_type}
                      </Badge>
                      
                      <div className="flex-1 text-sm">
                        {interaction.element_selector && (
                          <div className="font-mono text-xs text-muted-foreground">
                            {interaction.element_selector}
                          </div>
                        )}
                        {interaction.element_text && (
                          <div className="text-muted-foreground">
                            "{interaction.element_text.slice(0, 50)}..."
                          </div>
                        )}
                        {interaction.coordinates && (
                          <div className="text-xs text-muted-foreground">
                            x: {interaction.coordinates.x}, y: {interaction.coordinates.y}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{formatTime(interaction.timestamp_ms)}</div>
                        <div className="text-xs">
                          {interaction.session_id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}