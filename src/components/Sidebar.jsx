import React from 'react';
import { useProject } from '../store/ProjectContext';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Film,
  Mic,
  Sliders,
  PlaySquare,
  Clapperboard,
  FolderGit2,
  Settings,
  Activity
} from 'lucide-react';

export const Sidebar = () => {
  const { activeModule, setActiveModule } = useProject();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
    { id: 'new-project', label: 'New Project', icon: PlusCircle, group: 'main' },
    { id: 'ai-script', label: 'AI Script Gen', icon: Sparkles, group: 'creation' },
    { id: 'storyboard', label: 'Storyboard', icon: Film, group: 'creation' },
    { id: 'voice-studio', label: 'Voice Studio', icon: Mic, group: 'creation' },
    { id: 'motion-editor', label: 'Motion Editor', icon: Sliders, group: 'creation' },
    { id: 'preview-studio', label: 'Video Preview', icon: PlaySquare, group: 'production' },
    { id: 'render-export', label: 'Render & Export', icon: Clapperboard, group: 'production' },
    { id: 'project-library', label: 'Project Library', icon: FolderGit2, group: 'system' },
    { id: 'settings', label: 'Settings', icon: Settings, group: 'system' }
  ];

  return (
    <aside className="w-56 bg-studio-900 border-r border-studio-800 flex flex-col justify-between py-3 select-none flex-shrink-0">
      <div className="space-y-4 px-2">
        {/* Navigation Sections */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Production Flow
          </div>
          <nav className="space-y-0.5">
            {navItems.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-electric-blue/15 text-electric-blue font-semibold border-l-2 border-electric-blue shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-studio-850/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-electric-blue' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Management
          </div>
          <nav className="space-y-0.5">
            {navItems.slice(8).map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-electric-blue/15 text-electric-blue font-semibold border-l-2 border-electric-blue shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-studio-850/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-electric-blue' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Status Panel */}
      <div className="px-3 pt-3 border-t border-studio-800">
        <div className="bg-studio-950 p-2.5 rounded-lg border border-studio-800/80 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-electric-emerald animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-300">Remotion Ready</span>
            <span className="text-[9px] text-slate-500 font-mono">FFmpeg + Chrome OK</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

