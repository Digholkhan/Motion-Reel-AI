import React, { useState } from 'react';
import { useProject } from '../../store/ProjectContext';
import { api } from '../../services/api';
import {
  Sparkles,
  Monitor,
  Smartphone,
  Square,
  Clock,
  Layers,
  Palette,
  Check,
  Loader2
} from 'lucide-react';

export const NewProject = () => {
  const { setCurrentProject, setActiveModule, showToast, saveCurrentProject } = useProject();

  const [title, setTitle] = useState('New Dynamic Motion Reel');
  const [topic, setTopic] = useState('AI Autonomous Agents in 2026');
  const [language, setLanguage] = useState('en');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [durationInSeconds, setDurationInSeconds] = useState(30);
  const [fps, setFps] = useState(30);
  const [themePreset, setThemePreset] = useState('electric-blue');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (newLang === 'bn') {
      setTitle('কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তির ভবিষ্যৎ');
      setTopic('কৃত্রিম বুদ্ধিমত্তা কীভাবে ২০২৬ সালে বদলে দিচ্ছে আমাদের জীবন');
    } else {
      setTitle('Next-Gen Autonomous AI Agents');
      setTopic('AI Autonomous Agents in 2026');
    }
  };

  const handleCreateWithAI = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic or prompt brief', 'warning');
      return;
    }

    try {
      setIsGenerating(true);
      showToast('Generating AI script & storyboard scenes...', 'info');

      // 1. Generate script
      const scriptData = await api.generateScript({
        topic,
        durationInSeconds,
        language
      });

      // 2. Generate storyboard scenes
      const storyboard = await api.generateStoryboard({
        script: scriptData.rawScript,
        topic,
        durationInSeconds,
        language
      });

      const selectedTheme = themePresets.find(t => t.id === themePreset) || themePresets[0];

      const newProj = {
        id: `proj-${Date.now()}`,
        title: title || `${topic} Motion Reel`,
        topic,
        language,
        aspectRatio,
        fps,
        durationInSeconds,
        theme: {
          preset: selectedTheme.id,
          primaryColor: selectedTheme.primary,
          secondaryColor: selectedTheme.secondary,
          bgColor: selectedTheme.bg,
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter'
        },
        voice: {
          enabled: true,
          provider: 'browser',
          voiceId: 'en-US-GuyNeural',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          audioUrl: null
        },
        music: {
          enabled: true,
          trackId: 'cyber-pulse',
          trackName: 'Cybernetic Pulse (Synthwave)',
          volume: 0.25,
          audioUrl: '/api/voice/audio/cyber-pulse.wav'
        },
        scenes: storyboard.scenes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const saved = await api.saveProject(newProj);
      setCurrentProject(saved);
      showToast('Motion reel generated successfully!', 'success');
      setActiveModule('preview-studio');
    } catch (err) {
      console.error('Project creation error:', err);
      showToast(`Creation failed: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateBlank = async () => {
    const selectedTheme = themePresets.find(t => t.id === themePreset) || themePresets[0];
    const newProj = {
      id: `proj-${Date.now()}`,
      title: title || 'Untitled Motion Project',
      topic: topic || 'Custom Motion',
      aspectRatio,
      fps,
      durationInSeconds,
      theme: {
        preset: selectedTheme.id,
        primaryColor: selectedTheme.primary,
        secondaryColor: selectedTheme.secondary,
        bgColor: selectedTheme.bg,
        fontHeading: 'Space Grotesk',
        fontBody: 'Inter'
      },
      voice: {
        enabled: true,
        provider: 'browser',
        voiceId: 'en-US-GuyNeural',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        audioUrl: null
      },
      music: {
        enabled: true,
        trackId: 'cyber-pulse',
        trackName: 'Cybernetic Pulse (Synthwave)',
        volume: 0.25,
        audioUrl: '/api/voice/audio/cyber-pulse.wav'
      },
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          order: 0,
          durationInSeconds: 5,
          archetype: 'KINETIC_TITLE',
          heading: (title || 'MOTIONFORGE').toUpperCase(),
          subheading: 'CUSTOM MOTION COMPOSITION',
          badge: '⚡ SCENE 1',
          caption: 'Scene 1',
          metrics: [],
          features: [],
          layout: 'center',
          motionPreset: 'energetic',
          colorPalette: {
            bg: selectedTheme.bg,
            accent: selectedTheme.primary,
            textPrimary: '#FFFFFF',
            textSecondary: '#94A3B8',
            glow: `${selectedTheme.primary}66`
          },
          transition: { type: 'zoom', durationInFrames: 15 },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' },
          voiceoverScript: ''
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await api.saveProject(newProj);
    setCurrentProject(saved);
    showToast('Blank project created', 'success');
    setActiveModule('storyboard');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-electric-blue" />
          <span>New Video Project Wizard</span>
        </h1>
        <p className="text-xs text-slate-400">
          Configure video dimensions, timing, color science, and prompt-to-motion settings.
        </p>
      </div>

      <div className="bg-studio-900 border border-studio-800 rounded-xl p-6 space-y-6">
        {/* Language Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Narrative Language
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                language === 'en'
                  ? 'bg-electric-blue/20 border-electric-blue text-white shadow-glow-blue'
                  : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('bn')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                language === 'bn'
                  ? 'bg-electric-purple/20 border-electric-purple text-white shadow-glow-purple'
                  : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
              }`}
            >
              বাংলা (Bangla)
            </button>
          </div>
        </div>

        {/* Title & Topic Prompt */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen Autonomous AI Reel"
              className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Topic / Brief Prompt
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe your video topic, core message, or key highlights..."
              className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Aspect Ratio & Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: '16:9', label: '16:9 Landscape', desc: 'YouTube, Web, TV', icon: Monitor },
              { id: '9:16', label: '9:16 Vertical', desc: 'TikTok, Reels, Shorts', icon: Smartphone },
              { id: '1:1', label: '1:1 Square', desc: 'Instagram, Feed, Posts', icon: Square }
            ].map((ar) => {
              const Icon = ar.icon;
              const isSelected = aspectRatio === ar.id;
              return (
                <div
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                    isSelected
                      ? 'bg-electric-blue/10 border-electric-blue text-white shadow-glow-blue'
                      : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-electric-blue' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">{ar.label}</div>
                    <div className="text-[11px] text-slate-400">{ar.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Duration & FPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Target Duration
            </label>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationInSeconds(dur)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    durationInSeconds === dur
                      ? 'bg-electric-purple/20 border-electric-purple text-electric-purple'
                      : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Framerate (FPS)
            </label>
            <div className="flex gap-2">
              {[24, 30, 60].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setFps(rate)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    fps === rate
                      ? 'bg-electric-cyan/20 border-electric-cyan text-electric-cyan'
                      : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
                  }`}
                >
                  {rate} fps
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Palette Theme */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Color Science & Atmosphere
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themePresets.map((thm) => {
              const isSelected = themePreset === thm.id;
              return (
                <div
                  key={thm.id}
                  onClick={() => setThemePreset(thm.id)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-studio-850 border-electric-blue'
                      : 'bg-studio-950 border-studio-800 hover:border-studio-750'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: thm.primary }}
                    />
                    <span className="text-xs font-medium text-slate-200">{thm.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-electric-blue" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-studio-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCreateBlank}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 text-xs font-medium border border-studio-750 transition-colors disabled:opacity-50"
          >
            Create Blank Project
          </button>

          <button
            type="button"
            onClick={handleCreateWithAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-electric-blue to-electric-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-bold shadow-glow-blue transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Storyboard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Motion Reel with AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

