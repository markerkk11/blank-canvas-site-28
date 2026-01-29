import { SilentSessionDashboard } from '@/components/SilentSessionDashboard';
import { SessionRecordingsViewer } from '@/components/SessionRecordingsViewer';
import { RealVideoRecorder } from '@/components/RealVideoRecorder';
import { AllVideosViewer } from '@/components/AllVideosViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sessions() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="all-videos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-videos">All Videos</TabsTrigger>
          <TabsTrigger value="video">Real Video Recording</TabsTrigger>
          <TabsTrigger value="recordings">Visual Screenshots</TabsTrigger>
          <TabsTrigger value="interactions">Interaction Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="all-videos">
          <AllVideosViewer />
        </TabsContent>

        <TabsContent value="video">
          <RealVideoRecorder />
        </TabsContent>

        <TabsContent value="recordings">
          <SessionRecordingsViewer />
        </TabsContent>

        <TabsContent value="interactions">
          <SilentSessionDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}