import React, { useState } from 'react';
import { useProject } from '../../store/ProjectContext';
import { api } from '../../services/api';
import {
  Film,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Play,
  Volume2,
  Layers,
  ArrowRight,
  Loader2,
  Eye,
  MessageSquare,
  Wand2,
  Tag,
  Palette,
  VolumeX,
  X
} from 'lucide-react';

export const StoryboardEditor = () => {
  const {
    currentProject,
    updateScene,
    addScene,
    deleteScene,
    moveScene,
    activeSceneIndex,
    setActiveSceneIndex,
    setActiveModule,
    showToast
  } = useProject();

  const [regeneratingIndex, setRegeneratingIndex] = useState(null);
  const [regenPromptModal, setRegenPromptModal] = useState(null); // { index, scene }
  const [regenInstruction, setRegenInstruction] = useState('');
  const [previewSceneDrawer, setPreviewSceneDrawer] = useState(null); // active scene to preview
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  const scenes = currentProject?.scenes || [];
  const fps = currentProject?.fps || 30;

  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationInSeconds || 5), 0);

  // Open regeneration modal
  const openRegenerateModal = (scene, index) => {
    setRegenPromptModal({ index, scene });
    setRegenInstruction('');
  };

  // Execute single scene regeneration
  const handleRegenerateScene = async (instruction = '') => {
    if (!regenPromptModal) return;
    const { scene, index } = regenPromptModal;

    try {
      setRegeneratingIndex(index);
      setRegenPromptModal(null);
      showToast(`Regenerating Scene ${index + 1}...`, 'info');

      const updated = await api.regenerateScene({
        currentScene: scene,
        instruction: instruction || 'Make it more dynamic and cinematic'
      });

      updateScene(index, updated);
      showToast(`Scene ${index + 1} regenerated successfully!`, 'success');
      if (previewSceneDrawer?.id === scene.id) {
        setPreviewSceneDrawer(updated);
      }
    } catch (err) {
      console.error('Failed to regenerate scene:', err);
      showToast(`Regeneration failed: ${err.message}`, 'error');
    } finally {
      setRegeneratingIndex(null);
    }
  };

  // Audio preview for voiceover text
  const previewVoiceover = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser', 'warning');
      return;
    }

    window.speechSynthesis.cancel();
    if (isPlayingSpeech) {
      setIsPlayingSpeech(false);
      return;
    }

    const cleanText = text || 'MotionForge AI procedural motion graphics.';
    const isBengali = /[\u0980-\u09FF]/.test(cleanText);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isBengali ? 'bn-BD' : 'en-US';
    utterance.rate = currentProject?.voice?.rate || 1.0;
    utterance.pitch = currentProject?.voice?.pitch || 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (isBengali) {
      const bnVoice = voices.find(v => v.lang.includes('bn'));
      if (bnVoice) utterance.voice = bnVoice;
    } else {
      const enVoice = voices.find(v => v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => setIsPlayingSpeech(true);
    utterance.onend = () => setIsPlayingSpeech(false);
    utterance.onerror = () => setIsPlayingSpeech(false);

    window.speechSynthesis.speak(utterance);
  };

  const getArchetypeColor = (archetype) => {
    switch (archetype) {
      case 'TECH_HUD': return 'border-electric-cyan text-electric-cyan bg-electric-cyan/10';
      case 'METRIC_COUNTER': return 'border-electric-purple text-electric-purple bg-electric-purple/10';
      case 'FEATURE_CARDS': return 'border-electric-blue text-electric-blue bg-electric-blue/10';
      case 'ISOMETRIC_BADGE': return 'border-electric-pink text-electric-pink bg-electric-pink/10';
      case 'CALL_TO_ACTION': return 'border-electric-amber text-electric-amber bg-electric-amber/10';
      default: return 'border-blue-400 text-blue-400 bg-blue-400/10';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 select-none relative">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-electric-purple" />
            <span>Storyboard Editor & Visual Planner</span>
          </h1>
          <p className="text-xs text-slate-400">
            Data-driven scene graph with frame-accurate timing, voiceover sync, and visual art direction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => addScene()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 text-xs font-semibold border border-studio-750 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-electric-blue" />
            <span>Add Scene</span>
          </button>

          <button
            onClick={() => setActiveModule('preview-studio')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Preview in Player</span>
          </button>
        </div>
      </div>

      {/* Timeline Proportional Strip */}
      <div className="bg-studio-900 border border-studio-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-electric-blue" />
            <span>Total Timeline: {totalDuration}s ({Math.round(totalDuration * fps)} frames)</span>
          </span>
          <span className="text-electric-cyan">{scenes.length} Dynamic Scenes</span>
        </div>

        <div className="h-5 w-full bg-studio-950 rounded-lg overflow-hidden flex gap-1 p-1 border border-studio-800">
          {scenes.map((s, idx) => {
            const widthPct = Math.max(6, ((s.durationInSeconds || 5) / (totalDuration || 1)) * 100);
            return (
              <div
                key={s.id || idx}
                onClick={() => setPreviewSceneDrawer(s)}
                title={`Scene ${idx + 1}: ${s.heading} (${s.startTime || 0}s - ${(s.startTime || 0) + (s.durationInSeconds || 5)}s)`}
                style={{ width: `${widthPct}%` }}
                className="h-full bg-gradient-to-r from-electric-blue/40 to-electric-purple/40 hover:from-electric-blue hover:to-electric-purple rounded-sm cursor-pointer transition-all flex items-center justify-between px-1.5"
              >
                <span className="text-[9px] font-mono font-bold text-white/90 truncate">
                  S{idx + 1}
                </span>
                <span className="text-[8px] font-mono text-white/70">
                  {s.durationInSeconds}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenes.map((scene, index) => {
          const isRegen = regeneratingIndex === index;
          const badgeClass = getArchetypeColor(scene.archetype);
          const endTime = ((scene.startTime || 0) + (scene.durationInSeconds || 5)).toFixed(1);

          return (
            <div
              key={scene.id || index}
              className="bg-studio-900 border border-studio-800 hover:border-studio-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all group"
            >
              {/* Card Top: Number, Archetype, Reorder, Timecode */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-studio-800 border border-studio-700 flex items-center justify-center text-xs font-mono font-bold text-white">
                      {index + 1}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
                      {scene.archetype.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Move Left / Right Controls */}
                  <div className="flex items-center gap-1 bg-studio-950 rounded-lg p-0.5 border border-studio-800">
                    <button
                      onClick={() => moveScene(index, -1)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-studio-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Move Earlier"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveScene(index, 1)}
                      disabled={index === scenes.length - 1}
                      className="p-1 rounded hover:bg-studio-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Move Later"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Timing & Timecode Row */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-studio-950 border border-studio-800 text-[11px] font-mono text-slate-300">
                  <span className="text-electric-cyan">
                    Time: {scene.startTime || 0}s – {endTime}s
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={scene.durationInSeconds || 5}
                      onChange={(e) =>
                        updateScene(index, {
                          durationInSeconds: Math.max(1, Math.min(30, Number(e.target.value)))
                        })
                      }
                      className="w-10 bg-studio-900 border border-studio-700 px-1 py-0.5 rounded text-white text-center font-bold outline-none"
                    />
                    <span className="text-slate-400 text-[10px]">sec</span>
                  </div>
                </div>

                {/* Heading & Subheading Input */}
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={scene.heading}
                    onChange={(e) =>
                      updateScene(index, {
                        heading: e.target.value,
                        onScreenText: { ...(scene.onScreenText || {}), heading: e.target.value }
                      })
                    }
                    className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none transition-colors"
                    placeholder="Headline"
                  />
                  <textarea
                    rows={2}
                    value={scene.subheading || ''}
                    onChange={(e) =>
                      updateScene(index, {
                        subheading: e.target.value,
                        onScreenText: { ...(scene.onScreenText || {}), subheading: e.target.value }
                      })
                    }
                    className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none resize-none transition-colors"
                    placeholder="Supporting subtitle..."
                  />
                </div>

                {/* Voiceover Script Box */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-electric-blue" />
                      <span>Voiceover Narration</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => previewVoiceover(scene.voiceoverText || scene.subheading || scene.heading)}
                      className="text-electric-blue hover:underline"
                    >
                      {isPlayingSpeech ? 'Stop' : 'Listen'}
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={scene.voiceoverText || scene.voiceoverScript || ''}
                    onChange={(e) =>
                      updateScene(index, {
                        voiceoverText: e.target.value,
                        voiceoverScript: e.target.value
                      })
                    }
                    placeholder="Voiceover spoken line for this scene..."
                    className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none resize-none transition-colors"
                  />
                </div>

                {/* Emphasized Keywords */}
                {scene.emphasizedKeywords && scene.emphasizedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {scene.emphasizedKeywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-electric-blue/10 text-electric-blue border border-electric-blue/25"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Action Controls */}
              <div className="pt-3 border-t border-studio-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openRegenerateModal(scene, index)}
                    disabled={isRegen}
                    className="p-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 hover:text-white border border-studio-750 transition-colors disabled:opacity-50 flex items-center gap-1 text-xs"
                    title="Regenerate scene with AI"
                  >
                    {isRegen ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-blue" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-electric-purple" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteScene(index)}
                    className="p-1.5 rounded-lg bg-studio-850 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-studio-750 transition-colors"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewSceneDrawer(scene)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 text-xs font-medium border border-studio-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 text-electric-cyan" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSceneIndex(index);
                      setActiveModule('motion-editor');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-electric-blue/15 hover:bg-electric-blue/25 text-electric-blue text-xs font-semibold border border-electric-blue/30 transition-all"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Motion</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Storyboard Preview / Inspect Modal Drawer */}
      {previewSceneDrawer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-studio-900 border border-studio-750 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-electric-blue" />
                <h3 className="text-base font-bold text-white">
                  Scene {previewSceneDrawer.order + 1} Storyboard Inspector
                </h3>
              </div>
              <button
                onClick={() => setPreviewSceneDrawer(null)}
                className="p-1.5 rounded-lg hover:bg-studio-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-studio-950 p-2.5 rounded-lg border border-studio-800">
                <span className="text-slate-400 text-[10px] block">ARCHETYPE</span>
                <span className="text-white font-bold">{previewSceneDrawer.archetype}</span>
              </div>
              <div className="bg-studio-950 p-2.5 rounded-lg border border-studio-800">
                <span className="text-slate-400 text-[10px] block">TIMECODE</span>
                <span className="text-electric-cyan font-bold">{previewSceneDrawer.startTime}s – {(previewSceneDrawer.startTime + previewSceneDrawer.durationInSeconds).toFixed(1)}s</span>
              </div>
              <div className="bg-studio-950 p-2.5 rounded-lg border border-studio-800">
                <span className="text-slate-400 text-[10px] block">TRANSITION</span>
                <span className="text-electric-purple font-bold uppercase">{previewSceneDrawer.transitionType || previewSceneDrawer.transition?.type}</span>
              </div>
              <div className="bg-studio-950 p-2.5 rounded-lg border border-studio-800">
                <span className="text-slate-400 text-[10px] block">BACKGROUND</span>
                <span className="text-slate-200 font-bold">{previewSceneDrawer.backgroundStyle || 'matrix-grid'}</span>
              </div>
            </div>

            {/* Visual Description */}
            {previewSceneDrawer.visualDescription && (
              <div className="p-3.5 rounded-lg bg-studio-950 border border-studio-800 space-y-1 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-electric-blue font-mono">
                  Visual Description & Art Direction
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {previewSceneDrawer.visualDescription}
                </p>
              </div>
            )}

            {/* Animation Instructions */}
            {previewSceneDrawer.animationInstructions && (
              <div className="p-3.5 rounded-lg bg-studio-950 border border-studio-800 space-y-1 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-electric-purple font-mono">
                  Animation & Kinetic Choreography
                </div>
                <p className="text-slate-300 leading-relaxed font-mono">
                  {previewSceneDrawer.animationInstructions}
                </p>
              </div>
            )}

            {/* Voiceover Narration */}
            <div className="p-3.5 rounded-lg bg-studio-950 border border-studio-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-electric-cyan font-mono">
                <span>Spoken Voiceover Script</span>
                <button
                  onClick={() => previewVoiceover(previewSceneDrawer.voiceoverText || previewSceneDrawer.heading)}
                  className="flex items-center gap-1 text-electric-blue hover:underline cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{isPlayingSpeech ? 'Stop Speech' : 'Play Speech'}</span>
                </button>
              </div>
              <p className="text-slate-200 font-medium italic">
                "{previewSceneDrawer.voiceoverText || previewSceneDrawer.voiceoverScript || previewSceneDrawer.heading}"
              </p>
            </div>

            {/* Sound Effect Suggestions */}
            {previewSceneDrawer.soundEffectSuggestions && previewSceneDrawer.soundEffectSuggestions.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Suggested Sound Effects
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewSceneDrawer.soundEffectSuggestions.map((sfx, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-studio-950 border border-studio-800 text-electric-amber text-[11px] font-mono"
                    >
                      🔊 {sfx}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewSceneDrawer(null)}
                className="px-4 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Scene Regeneration Modal */}
      {regenPromptModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-studio-900 border border-studio-750 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-electric-purple" />
                <h3 className="text-sm font-bold text-white">
                  Regenerate Scene {regenPromptModal.index + 1} with AI
                </h3>
              </div>
              <button
                onClick={() => setRegenPromptModal(null)}
                className="p-1 rounded hover:bg-studio-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide optional guidance or instructions for how the AI should rewrite this scene's choreography, archetype, and narrative.
            </p>

            <textarea
              rows={3}
              value={regenInstruction}
              onChange={(e) => setRegenInstruction(e.target.value)}
              placeholder="e.g. Focus on high-speed metric benchmarks, make it more dramatic, or বাংলায় রূপান্তর করুন..."
              className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg p-3 text-xs text-white outline-none resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleRegenerateScene('')}
                className="px-3.5 py-2 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 text-xs font-medium border border-studio-750"
              >
                Auto Regenerate
              </button>

              <button
                onClick={() => handleRegenerateScene(regenInstruction)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-bold shadow-glow-blue"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Execute AI Regeneration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
