import React from 'react';
import { useProject } from '../../store/ProjectContext';
import {
  Sliders,
  Type,
  Layers,
  Palette,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Grid,
  Zap,
  Activity,
  Play
} from 'lucide-react';

export const MotionEditor = () => {
  const {
    currentProject,
    activeSceneIndex,
    setActiveSceneIndex,
    updateScene,
    setActiveModule
  } = useProject();

  const scenes = currentProject?.scenes || [];
  const currentScene = scenes[activeSceneIndex] || scenes[0];

  if (!currentScene) {
    return (
      <div className="p-8 text-center text-slate-400">
        No scenes available to edit. Please create a project first.
      </div>
    );
  }

  const archetypes = [
    { id: 'KINETIC_TITLE', label: 'Kinetic Title' },
    { id: 'TECH_HUD', label: 'Tech HUD' },
    { id: 'METRIC_COUNTER', label: 'Metric Counter' },
    { id: 'FEATURE_CARDS', label: 'Feature Cards' },
    { id: 'ISOMETRIC_BADGE', label: 'Isometric Badge' },
    { id: 'CALL_TO_ACTION', label: 'Call to Action' }
  ];

  const handleUpdate = (field, value) => {
    updateScene(activeSceneIndex, { [field]: value });
  };

  const handleColorUpdate = (colorKey, value) => {
    updateScene(activeSceneIndex, {
      colorPalette: {
        ...currentScene.colorPalette,
        [colorKey]: value
      }
    });
  };

  const handleVisualsUpdate = (visKey, value) => {
    updateScene(activeSceneIndex, {
      visualElements: {
        ...currentScene.visualElements,
        [visKey]: value
      }
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Bar: Scene Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-electric-cyan" />
            <span>Motion Graphics Editor</span>
          </h1>
          <p className="text-xs text-slate-400">
            Fine-tune kinetic typography, procedurals, shapes, and motion physics for Scene {activeSceneIndex + 1}.
          </p>
        </div>

        {/* Scene Switcher Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-studio-900 border border-studio-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveSceneIndex(Math.max(0, activeSceneIndex - 1))}
              disabled={activeSceneIndex === 0}
              className="p-1.5 rounded hover:bg-studio-800 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {scenes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                    idx === activeSceneIndex
                      ? 'bg-electric-blue text-white shadow-glow-blue'
                      : 'text-slate-400 hover:bg-studio-800 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveSceneIndex(Math.min(scenes.length - 1, activeSceneIndex + 1))}
              disabled={activeSceneIndex === scenes.length - 1}
              className="p-1.5 rounded hover:bg-studio-800 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setActiveModule('preview-studio')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Preview in Player</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Archetype & Typography */}
        <div className="lg:col-span-6 space-y-5">
          {/* Archetype Selector */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Scene Composition Archetype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {archetypes.map((arch) => {
                const isSelected = currentScene.archetype === arch.id;
                return (
                  <button
                    key={arch.id}
                    onClick={() => handleUpdate('archetype', arch.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'bg-electric-blue/15 border-electric-blue text-electric-blue'
                        : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
                    }`}
                  >
                    {arch.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography & Copy */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-studio-800">
              <Type className="w-4 h-4 text-electric-blue" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Kinetic Copy & Labels
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Floating Badge
                </label>
                <input
                  type="text"
                  value={currentScene.badge || ''}
                  onChange={(e) => handleUpdate('badge', e.target.value)}
                  placeholder="e.g. ⚡ NEXT-GEN MOTION ENGINE"
                  className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Primary Headline (Kinetic)
                </label>
                <input
                  type="text"
                  value={currentScene.heading || ''}
                  onChange={(e) => handleUpdate('heading', e.target.value)}
                  placeholder="e.g. AUTONOMOUS MOTION CORE"
                  className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3 py-2 text-xs font-bold text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Subheading
                </label>
                <textarea
                  rows={2}
                  value={currentScene.subheading || ''}
                  onChange={(e) => handleUpdate('subheading', e.target.value)}
                  placeholder="Supporting secondary text line..."
                  className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3 py-2 text-xs text-slate-300 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Archetype Specific Sub-editors */}
          {currentScene.archetype === 'METRIC_COUNTER' && (
            <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-studio-800">
                <span className="text-xs font-bold text-white uppercase font-mono">
                  Metric Counters
                </span>
                <button
                  onClick={() => {
                    const currentMetrics = currentScene.metrics || [];
                    handleUpdate('metrics', [
                      ...currentMetrics,
                      { label: 'NEW STAT', value: '100%', targetNumber: 100, suffix: '%', prefix: '' }
                    ]);
                  }}
                  className="flex items-center gap-1 text-[11px] text-electric-blue font-semibold hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Stat</span>
                </button>
              </div>

              <div className="space-y-2">
                {(currentScene.metrics || []).map((m, idx) => (
                  <div key={idx} className="bg-studio-950 p-2.5 rounded-lg border border-studio-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const newM = [...currentScene.metrics];
                        newM[idx] = { ...newM[idx], label: e.target.value };
                        handleUpdate('metrics', newM);
                      }}
                      className="w-28 bg-studio-900 border border-studio-700 px-2 py-1 rounded text-xs text-white"
                      placeholder="Label"
                    />
                    <input
                      type="number"
                      value={m.targetNumber}
                      onChange={(e) => {
                        const newM = [...currentScene.metrics];
                        newM[idx] = { ...newM[idx], targetNumber: Number(e.target.value) };
                        handleUpdate('metrics', newM);
                      }}
                      className="w-20 bg-studio-900 border border-studio-700 px-2 py-1 rounded text-xs text-white"
                      placeholder="Target"
                    />
                    <input
                      type="text"
                      value={m.suffix}
                      onChange={(e) => {
                        const newM = [...currentScene.metrics];
                        newM[idx] = { ...newM[idx], suffix: e.target.value };
                        handleUpdate('metrics', newM);
                      }}
                      className="w-14 bg-studio-900 border border-studio-700 px-2 py-1 rounded text-xs text-white"
                      placeholder="Suffix"
                    />
                    <button
                      onClick={() => {
                        const newM = currentScene.metrics.filter((_, i) => i !== idx);
                        handleUpdate('metrics', newM);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Elements, Color Science & Timing */}
        <div className="lg:col-span-6 space-y-5">
          {/* Visual Elements Toggles */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-studio-800">
              <Layers className="w-4 h-4 text-electric-purple" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Visual Elements & Layers
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg bg-studio-950 border border-studio-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentScene.visualElements?.showGrid ?? true}
                  onChange={(e) => handleVisualsUpdate('showGrid', e.target.checked)}
                  className="accent-electric-blue"
                />
                <span className="text-xs text-slate-200">Perspective Grid</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg bg-studio-950 border border-studio-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentScene.visualElements?.showParticles ?? true}
                  onChange={(e) => handleVisualsUpdate('showParticles', e.target.checked)}
                  className="accent-electric-blue"
                />
                <span className="text-xs text-slate-200">Floating Particles</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg bg-studio-950 border border-studio-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentScene.visualElements?.showOrb ?? true}
                  onChange={(e) => handleVisualsUpdate('showOrb', e.target.checked)}
                  className="accent-electric-blue"
                />
                <span className="text-xs text-slate-200">Glowing Radial Orb</span>
              </label>

              <div className="p-2.5 rounded-lg bg-studio-950 border border-studio-800 flex items-center justify-between">
                <span className="text-xs text-slate-200">Shape</span>
                <select
                  value={currentScene.visualElements?.shapeType || 'circles'}
                  onChange={(e) => handleVisualsUpdate('shapeType', e.target.value)}
                  className="bg-studio-900 border border-studio-700 text-xs text-slate-300 rounded px-2 py-1 outline-none"
                >
                  <option value="circles">Circles</option>
                  <option value="hexagons">Hexagons</option>
                  <option value="lines">Lines</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-studio-800">
              <Palette className="w-4 h-4 text-electric-cyan" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Scene Color Palette
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2 bg-studio-950 border border-studio-800 rounded-lg p-2">
                  <input
                    type="color"
                    value={currentScene.colorPalette?.accent || '#3B82F6'}
                    onChange={(e) => handleColorUpdate('accent', e.target.value)}
                    className="w-7 h-7 rounded border border-studio-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">
                    {currentScene.colorPalette?.accent || '#3B82F6'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2 bg-studio-950 border border-studio-800 rounded-lg p-2">
                  <input
                    type="color"
                    value={currentScene.colorPalette?.bg || '#070B14'}
                    onChange={(e) => handleColorUpdate('bg', e.target.value)}
                    className="w-7 h-7 rounded border border-studio-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">
                    {currentScene.colorPalette?.bg || '#070B14'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timing & Motion Preset */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-studio-800">
              <Zap className="w-4 h-4 text-electric-amber" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Physics & Motion Preset
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['energetic', 'smooth', 'cyber', 'minimal', 'dramatic'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleUpdate('motionPreset', preset)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border capitalize transition-all ${
                    currentScene.motionPreset === preset
                      ? 'bg-electric-amber/15 border-electric-amber text-electric-amber'
                      : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

