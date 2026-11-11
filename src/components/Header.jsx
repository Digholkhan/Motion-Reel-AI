import React from 'react';
import { useProject } from '../store/ProjectContext';
import {
  Sparkles,
  Save,
  Play,
  Download,
  Film,
  Monitor,
  Smartphone,
  Square,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const Header = () => {
  const {
    currentProject,
    updateProjectField,
    saveCurrentProject,
    saving,
    setActiveModule,
    activeModule
  } = useProject();

  const totalSeconds = (currentProject?.scenes || []).reduce(
    (acc, s) => acc + (s.durationInSeconds || 5),
    0
  ) || currentProject?.durationInSeconds || 30;

  const totalFrames = totalSeconds * (currentProject?.fps || 30);

  return (
    <header className="h-14 bg-studio-900 border-b border-studio-800 flex items-center justify-between px-4 z-50 select-none">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setActiveModule('dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-electric-purple flex items-center justify-center shadow-glow-blue">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-white font-mono group-hover:text-electric-blue transition-colors">
              MOTIONFORGE<span className="text-electric-blue">.AI</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest font-mono">
              MOTION ENGINE V1.0
            </span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-studio-800" />

        {/* Current Project Name */}
        {currentProject && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentProject.title}
              onChange={(e) => updateProjectField('title', e.target.value)}
              className="bg-transparent hover:bg-studio-800/60 focus:bg-studio-950 px-2 py-1 rounded text-xs font-medium text-slate-200 border border-transparent hover:border-studio-700 focus:border-electric-blue transition-colors max-w-[280px] truncate outline-none"
              title="Click to edit project title"
            />
          </div>
        )}
      </div>

      {/* Center Metadata Badges */}
      {currentProject && (
        <div className="hidden md:flex items-center gap-3">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center bg-studio-950 rounded-lg p-0.5 border border-studio-800 text-[11px]">
            <button
              onClick={() => updateProjectField('aspectRatio', '16:9')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                currentProject.aspectRatio === '16:9'
                  ? 'bg-electric-blue text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="16:9 Landscape"
            >
              <Monitor className="w-3 h-3" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => updateProjectField('aspectRatio', '9:16')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                currentProject.aspectRatio === '9:16'
                  ? 'bg-electric-blue text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="9:16 Vertical Reel"
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => updateProjectField('aspectRatio', '1:1')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                currentProject.aspectRatio === '1:1'
                  ? 'bg-electric-blue text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="1:1 Square"
            >
              <Square className="w-3 h-3" />
              <span>1:1</span>
            </button>
          </div>

          {/* FPS Selector */}
          <div className="flex items-center bg-studio-950 rounded-lg p-0.5 border border-studio-800 text-[11px]">
            {[24, 30, 60].map((fps) => (
              <button
                key={fps}
                onClick={() => updateProjectField('fps', fps)}
                className={`px-2 py-1 rounded transition-colors ${
                  currentProject.fps === fps
                    ? 'bg-studio-800 text-electric-cyan font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fps} fps
              </button>
            ))}
          </div>

          {/* Duration & Frame Count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-studio-950 rounded-lg border border-studio-800 text-[11px] font-mono text-slate-300">
            <Clock className="w-3 h-3 text-electric-purple" />
            <span>{totalSeconds}s</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{totalFrames} frames</span>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={saveCurrentProject}
          disabled={saving || !currentProject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 hover:text-white border border-studio-750 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-blue" />
          ) : (
            <Save className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>

        <button
          onClick={() => setActiveModule('preview-studio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            activeModule === 'preview-studio'
              ? 'bg-electric-blue/15 border-electric-blue text-electric-blue'
              : 'bg-studio-850 hover:bg-studio-800 border-studio-750 text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => setActiveModule('render-export')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-electric-blue to-electric-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Render MP4</span>
        </button>
      </div>
    </header>
  );
};

