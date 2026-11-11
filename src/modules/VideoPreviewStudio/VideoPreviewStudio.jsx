import React, { useRef, useState } from 'react';
import { Player } from '@remotion/player';
import { useProject } from '../../store/ProjectContext';
import { MotionReel } from '../../remotion/MotionReel';
import { AspectRatioDimensions } from '../../schemas/projectSchema';
import {
  PlaySquare,
  Monitor,
  Smartphone,
  Square,
  Download,
  Film,
  Sparkles,
  Maximize2,
  RotateCcw,
  Sliders,
  Layers
} from 'lucide-react';

export const VideoPreviewStudio = () => {
  const { currentProject, updateProjectField, setActiveModule } = useProject();
  const playerRef = useRef(null);

  const aspectRatio = currentProject?.aspectRatio || '16:9';
  const fps = currentProject?.fps || 30;

  const totalDuration = (currentProject?.scenes || []).reduce(
    (acc, s) => acc + (s.durationInSeconds || 5),
    0
  ) || currentProject?.durationInSeconds || 30;

  const totalFrames = Math.max(30, Math.round(totalDuration * fps));

  const dims = AspectRatioDimensions[aspectRatio] || AspectRatioDimensions['16:9'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-electric-blue" />
            <span>Video Preview Studio</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time Remotion player with frame-accurate timeline scrubbing and audio preview.
          </p>
        </div>

        {/* Aspect Ratio Switcher & Render Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-studio-900 border border-studio-800 rounded-lg p-1 gap-1 text-xs">
            <button
              onClick={() => updateProjectField('aspectRatio', '16:9')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-electric-blue text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => updateProjectField('aspectRatio', '9:16')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-electric-blue text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => updateProjectField('aspectRatio', '1:1')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-all ${
                aspectRatio === '1:1'
                  ? 'bg-electric-blue text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>1:1</span>
            </button>
          </div>

          <button
            onClick={() => setActiveModule('render-export')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-bold shadow-glow-blue transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Render MP4</span>
          </button>
        </div>
      </div>

      {/* Main Preview Player Container */}
      <div className="bg-studio-900 border border-studio-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-electric-blue/10 blur-[100px] pointer-events-none" />

        {/* Player Viewport */}
        <div
          style={{
            maxWidth: aspectRatio === '9:16' ? '380px' : aspectRatio === '1:1' ? '540px' : '960px',
            aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9',
            width: '100%'
          }}
          className="relative rounded-xl overflow-hidden border border-studio-750 shadow-2xl bg-black"
        >
          <Player
            ref={playerRef}
            component={MotionReel}
            inputProps={{ project: currentProject }}
            durationInFrames={totalFrames}
            compositionWidth={dims.width}
            compositionHeight={dims.height}
            fps={fps}
            style={{
              width: '100%',
              height: '100%'
            }}
            controls
            autoPlay={false}
            loop
          />
        </div>

        {/* Bottom Timeline Scene Markers */}
        <div className="w-full max-w-4xl pt-4 border-t border-studio-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-300">
              {totalDuration}s • {totalFrames} frames • {fps} FPS
            </span>
            <span>•</span>
            <span className="text-electric-cyan font-mono">{dims.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('storyboard')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-700 transition-colors"
            >
              <Film className="w-3 h-3 text-electric-purple" />
              <span>Edit Storyboard</span>
            </button>
            <button
              onClick={() => setActiveModule('motion-editor')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-700 transition-colors"
            >
              <Sliders className="w-3 h-3 text-electric-cyan" />
              <span>Edit Active Scene</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

