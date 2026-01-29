import { useState, useEffect } from 'react';
import { getSupabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_name: string;
  user_session_id: string;
  user_id: string | null;
  page_url: string;
  page_title: string | null;
  metadata: Record<string, any>;
  timestamp: string;
}

interface AnalyticsStats {
  total_events: number;
  page_views: number;
  button_clicks: number;
  unique_sessions: number;
}

export function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<AnalyticsStats>({
    total_events: 0,
    page_views: 0,
    button_clicks: 0,
    unique_sessions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    setupRealTimeSubscription();
  }, []);

  const loadAnalytics = async () => {
    try {
      const supabase = await getSupabase();
      
      // Get recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Get stats
      const { data: statsData, error: statsError } = await supabase
        .from('analytics_events')
        .select('event_type, user_session_id')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      if (statsError) throw statsError;

      const newStats = {
        total_events: statsData?.length || 0,
        page_views: statsData?.filter(e => e.event_type === 'page_view').length || 0,
        button_clicks: statsData?.filter(e => e.event_type === 'button_click').length || 0,
        unique_sessions: new Set(statsData?.map(e => e.user_session_id)).size || 0,
      };

      setEvents(eventsData || []);
      setStats(newStats);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeSubscription = async () => {
    try {
      const supabase = await getSupabase();
      
      const channel = supabase
        .channel('analytics-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'analytics_events'
          },
          (payload) => {
            const newEvent = payload.new as AnalyticsEvent;
            setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
            
            // Update stats
            setStats(prev => ({
              ...prev,
              total_events: prev.total_events + 1,
              page_views: prev.page_views + (newEvent.event_type === 'page_view' ? 1 : 0),
              button_clicks: prev.button_clicks + (newEvent.event_type === 'button_click' ? 1 : 0),
            }));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return 'bg-blue-100 text-blue-800';
      case 'button_click':
        return 'bg-green-100 text-green-800';
      case 'form_submit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Real-Time Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_events}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.page_views}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Button Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.button_clicks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unique_sessions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Events */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Events</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getEventColor(event.event_type)}>
                      {event.event_type}
                    </Badge>
                    <div>
                      <div className="font-medium">{event.event_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.page_url}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No events yet. Start navigating and clicking to see real-time data!
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}