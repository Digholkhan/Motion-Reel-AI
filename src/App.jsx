import React from 'react';
import { ProjectProvider, useProject } from './store/ProjectContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './modules/Dashboard/Dashboard';
import { NewProject } from './modules/NewProject/NewProject';
import { AIScriptGenerator } from './modules/AIScriptGenerator/AIScriptGenerator';
import { StoryboardEditor } from './modules/StoryboardEditor/StoryboardEditor';
import { VoiceStudio } from './modules/VoiceStudio/VoiceStudio';
import { MotionEditor } from './modules/MotionEditor/MotionEditor';
import { VideoPreviewStudio } from './modules/VideoPreviewStudio/VideoPreviewStudio';
import { RenderExport } from './modules/RenderExport/RenderExport';
import { ProjectLibrary } from './modules/ProjectLibrary/ProjectLibrary';
import { Settings } from './modules/Settings/Settings';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';

const StudioContent = () => {
  const { activeModule, toastMessage, loading } = useProject();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'new-project':
        return <NewProject />;
      case 'ai-script':
        return <AIScriptGenerator />;
      case 'storyboard':
        return <StoryboardEditor />;
      case 'voice-studio':
        return <VoiceStudio />;
      case 'motion-editor':
        return <MotionEditor />;
      case 'preview-studio':
        return <VideoPreviewStudio />;
      case 'render-export':
        return <RenderExport />;
      case 'project-library':
        return <ProjectLibrary />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-studio-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        <div className="text-sm font-mono text-slate-300 tracking-wider">
          INITIALIZING MOTIONFORGE AI STUDIO...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-studio-950 text-slate-100 overflow-hidden">
      {/* Top Application Header */}
      <Header />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Module Sidebar */}
        <Sidebar />

        {/* Dynamic Module Canvas */}
        <main className="flex-1 overflow-y-auto bg-studio-950 bg-grid-pattern relative">
          {renderActiveModule()}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium border ${toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toastMessage.type === 'error'
                  ? 'bg-red-950/90 border-red-500/50 text-red-200'
                  : toastMessage.type === 'warning'
                    ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                    : 'bg-studio-900/95 border-electric-blue/50 text-slate-200'
              }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Info className="w-4 h-4 text-electric-blue" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <StudioContent />
    </ProjectProvider>

  );
}
