import React from 'react';
import { useProject } from '../../store/ProjectContext';
import {
  Sparkles,
  PlusCircle,
  Film,
  PlaySquare,
  Clapperboard,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders
} from 'lucide-react';

export const Dashboard = () => {
  const {
    projects,
    currentProject,
    setCurrentProject,
    setActiveModule,
    addScene
  } = useProject();

  const totalScenes = projects.reduce((acc, p) => acc + (p.scenes?.length || 0), 0);
  const currentSceneCount = currentProject?.scenes?.length || 0;

  const quickStarters = [
    {
      title: 'AI Product Launch',
      desc: 'High-impact kinetic typography with metric counters and 3D badge climax.',
      topic: 'AI Automation Platform',
      aspect: '16:9',
      style: 'Cyber / Tech'
    },
    {
      title: 'Viral Social Reel',
      desc: 'Punchy 9:16 vertical hook with rapid transitions optimized for TikTok & Shorts.',
      topic: 'Viral Growth Secrets',
      aspect: '9:16',
      style: 'Energetic'
    },
    {
      title: 'SaaS Metric Benchmark',
      desc: 'Data-driven visual narrative highlighting 10x throughput and ROI gains.',
      topic: 'Cloud Infrastructure Performance',
      aspect: '16:9',
      style: 'Futuristic HUD'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Top Banner */}
      <div className="relative rounded-2xl overflow-hidden p-8 border border-studio-800 bg-gradient-to-r from-studio-900 via-studio-850 to-studio-900 shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-electric-blue/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-20 w-80 h-80 rounded-full bg-electric-purple/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-electric-blue text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Motion Graphics Production</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
            Prompt to Motion Graphics in Seconds
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Generate frame-accurate kinetic typography, procedural SVG graphics, audio-synced transitions, and native MP4 exports powered by Remotion.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveModule('new-project')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Motion Reel</span>
            </button>

            <button
              onClick={() => setActiveModule('ai-script')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-studio-800 hover:bg-studio-750 text-slate-200 text-xs font-medium border border-studio-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-electric-purple" />
              <span>AI Script Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-studio-900/80 border border-studio-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-electric-blue/15 border border-electric-blue/30 flex items-center justify-center text-electric-blue">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{projects.length}</div>
            <div className="text-xs text-slate-400 font-medium">Saved Projects</div>
          </div>
        </div>

        <div className="bg-studio-900/80 border border-studio-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-electric-purple/15 border border-electric-purple/30 flex items-center justify-center text-electric-purple">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{currentSceneCount}</div>
            <div className="text-xs text-slate-400 font-medium">Active Scenes</div>
          </div>
        </div>

        <div className="bg-studio-900/80 border border-studio-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-electric-cyan/15 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">60 FPS</div>
            <div className="text-xs text-slate-400 font-medium">Remotion Target</div>
          </div>
        </div>

        <div className="bg-studio-900/80 border border-studio-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-electric-emerald/15 border border-electric-emerald/30 flex items-center justify-center text-electric-emerald">
            <Clapperboard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">Ready</div>
            <div className="text-xs text-slate-400 font-medium">FFmpeg Pipeline</div>
          </div>
        </div>
      </div>

      {/* Quick Starter Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-electric-blue" />
            <span>Quick Start Templates</span>
          </h2>
          <span className="text-xs text-slate-400">Pre-configured motion graphics compositions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStarters.map((starter, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveModule('ai-script');
              }}
              className="bg-studio-900/80 hover:bg-studio-850 border border-studio-800 hover:border-studio-700 p-5 rounded-xl cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-studio-800 text-electric-cyan border border-studio-700">
                  {starter.aspect}
                </span>
                <span className="text-[11px] text-slate-400">{starter.style}</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors mb-1">
                {starter.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {starter.desc}
              </p>
              <div className="flex items-center text-xs font-semibold text-electric-blue gap-1 group-hover:translate-x-1 transition-transform">
                <span>Create with AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Project Quick Action Bar */}
      {currentProject && (
        <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-electric-blue font-mono">
                Currently Loaded
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">{currentProject.aspectRatio}</span>
            </div>
            <h3 className="text-base font-bold text-white">{currentProject.title}</h3>
            <p className="text-xs text-slate-400">
              {currentProject.scenes?.length || 0} scenes • {currentProject.fps} FPS • {currentProject.durationInSeconds}s duration
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveModule('storyboard')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-studio-800 hover:bg-studio-750 text-slate-200 text-xs font-medium border border-studio-700 transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-electric-purple" />
              <span>Storyboard</span>
            </button>
            <button
              onClick={() => setActiveModule('motion-editor')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-studio-800 hover:bg-studio-750 text-slate-200 text-xs font-medium border border-studio-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-electric-cyan" />
              <span>Motion Editor</span>
            </button>
            <button
              onClick={() => setActiveModule('preview-studio')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue transition-colors"
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span>Launch Preview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

