import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../../store/ProjectContext';
import { api } from '../../services/api';
import {
  Mic,
  Volume2,
  Music,
  Upload,
  Play,
  Square,
  Sparkles,
  Check,
  Sliders,
  AudioWaveform,
  Clock,
  Radio
} from 'lucide-react';

export const VoiceStudio = () => {
  const { currentProject, updateProjectField, updateScene, showToast } = useProject();

  const [voices, setVoices] = useState([]);
  const [musicTracks, setMusicTracks] = useState([]);
  const [isPlayingTestVoice, setIsPlayingTestVoice] = useState(false);
  const [isPlayingMusicPreview, setIsPlayingMusicPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load available voices & music on mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const vList = await api.getVoices();
        const mList = await api.getMusicTracks();
        setVoices(vList);
        setMusicTracks(mList);
      } catch (err) {
        console.error('Failed to load audio assets:', err);
      }
    };
    fetchAssets();
  }, []);

  // Web Speech API browser TTS test
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser', 'warning');
      return;
    }

    window.speechSynthesis.cancel();
    if (isPlayingTestVoice) {
      setIsPlayingTestVoice(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text || 'Welcome to MotionForge AI.');
    utterance.rate = currentProject?.voice?.rate || 1.0;
    utterance.pitch = currentProject?.voice?.pitch || 1.0;
    utterance.volume = currentProject?.voice?.volume || 1.0;

    // Try finding matched system voice
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      utterance.voice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
    }

    utterance.onstart = () => setIsPlayingTestVoice(true);
    utterance.onend = () => setIsPlayingTestVoice(false);
    utterance.onerror = () => setIsPlayingTestVoice(false);

    window.speechSynthesis.speak(utterance);
  };

  // Music preview toggle
  const toggleMusicPreview = (url) => {
    if (!audioRef.current) return;

    if (isPlayingMusicPreview) {
      audioRef.current.pause();
      setIsPlayingMusicPreview(false);
    } else {
      audioRef.current.src = url;
      audioRef.current.volume = currentProject?.music?.volume ?? 0.25;
      audioRef.current.play().then(() => {
        setIsPlayingMusicPreview(true);
      }).catch(err => {
        console.error('Playback error:', err);
      });
    }
  };

  // Upload custom audio file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      showToast('Uploading audio file...', 'info');
      const uploaded = await api.uploadAudio(file);
      
      updateProjectField('music', {
        ...currentProject.music,
        enabled: true,
        trackId: uploaded.filename,
        trackName: uploaded.originalName,
        audioUrl: uploaded.url
      });

      showToast('Custom audio uploaded and applied to project', 'success');
    } catch (err) {
      console.error('Upload failed:', err);
      showToast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const scenes = currentProject?.scenes || [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      <audio ref={audioRef} onEnded={() => setIsPlayingMusicPreview(false)} />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Mic className="w-5 h-5 text-electric-blue" />
          <span>Voice & Audio Studio</span>
        </h1>
        <p className="text-xs text-slate-400">
          Choreograph voiceovers, speech cadence, ambient score, and timeline audio alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voiceover Settings */}
        <div className="lg:col-span-6 space-y-6">
          {/* Voice Engine Card */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-electric-blue" />
                <h3 className="text-sm font-bold text-white">Voiceover Persona</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-800 text-electric-cyan border border-studio-700">
                Web Audio Ready
              </span>
            </div>

            {/* Voice Persona List */}
            <div className="space-y-2">
              {voices.map((v) => {
                const isSelected = currentProject?.voice?.voiceId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() =>
                      updateProjectField('voice', {
                        ...currentProject.voice,
                        voiceId: v.id
                      })
                    }
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-electric-blue/15 border-electric-blue text-white'
                        : 'bg-studio-950 border-studio-800 text-slate-300 hover:border-studio-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{v.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.lang} • {v.gender}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-electric-blue" />}
                  </div>
                );
              })}
            </div>

            {/* Speech Sliders: Rate & Pitch */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Speed</span>
                  <span className="text-electric-blue">{currentProject?.voice?.rate || 1.0}x</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.5}
                  step={0.1}
                  value={currentProject?.voice?.rate || 1.0}
                  onChange={(e) =>
                    updateProjectField('voice', {
                      ...currentProject.voice,
                      rate: Number(e.target.value)
                    })
                  }
                  className="w-full accent-electric-blue cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Pitch</span>
                  <span className="text-electric-blue">{currentProject?.voice?.pitch || 1.0}x</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.3}
                  step={0.1}
                  value={currentProject?.voice?.pitch || 1.0}
                  onChange={(e) =>
                    updateProjectField('voice', {
                      ...currentProject.voice,
                      pitch: Number(e.target.value)
                    })
                  }
                  className="w-full accent-electric-blue cursor-pointer"
                />
              </div>
            </div>

            {/* Test Voice Button */}
            <button
              onClick={() => speakText("MotionForge AI. Autonomous procedural motion graphics.")}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-studio-800 hover:bg-studio-750 text-slate-200 text-xs font-semibold border border-studio-700 transition-colors"
            >
              {isPlayingTestVoice ? <Square className="w-3.5 h-3.5 text-red-400" /> : <Play className="w-3.5 h-3.5 text-electric-blue" />}
              <span>{isPlayingTestVoice ? 'Stop Test Audio' : 'Preview Voice Persona'}</span>
            </button>
          </div>

          {/* Background Music Card */}
          <div className="bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-electric-purple" />
                <h3 className="text-sm font-bold text-white">Atmospheric Background Score</h3>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableMusic"
                  checked={currentProject?.music?.enabled ?? true}
                  onChange={(e) =>
                    updateProjectField('music', {
                      ...currentProject.music,
                      enabled: e.target.checked
                    })
                  }
                  className="accent-electric-purple cursor-pointer"
                />
                <label htmlFor="enableMusic" className="text-xs text-slate-300 cursor-pointer">
                  Enabled
                </label>
              </div>
            </div>

            {/* Built-in Tracks */}
            <div className="space-y-2">
              {musicTracks.map((track) => {
                const isSelected = currentProject?.music?.trackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() =>
                      updateProjectField('music', {
                        ...currentProject.music,
                        trackId: track.id,
                        trackName: track.name,
                        audioUrl: track.url
                      })
                    }
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-electric-purple/15 border-electric-purple text-white'
                        : 'bg-studio-950 border-studio-800 text-slate-300 hover:border-studio-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{track.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{track.mood} • {track.tempo}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMusicPreview(track.url);
                        }}
                        className="p-1 rounded hover:bg-studio-800 text-slate-400 hover:text-white"
                        title="Listen to preview"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      {isSelected && <Check className="w-4 h-4 text-electric-purple" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Music Upload */}
            <div className="pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-studio-950 hover:bg-studio-850 text-slate-300 text-xs font-medium border border-dashed border-studio-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-electric-cyan" />
                <span>{uploading ? 'Uploading audio...' : 'Upload Custom MP3 / WAV Audio'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Scene-by-Scene Voiceover Script Alignment */}
        <div className="lg:col-span-6 bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-electric-cyan" />
                <h3 className="text-sm font-bold text-white">Scene Voiceover Alignment</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{scenes.length} Scenes</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id || idx}
                  className="bg-studio-950 border border-studio-800/80 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-electric-blue">
                      Scene {idx + 1} • {scene.archetype.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400">{scene.durationInSeconds}s</span>
                  </div>

                  <textarea
                    rows={2}
                    value={scene.voiceoverScript || ''}
                    onChange={(e) =>
                      updateScene(idx, { voiceoverScript: e.target.value })
                    }
                    placeholder={`Spoken lines for scene ${idx + 1}...`}
                    className="w-full bg-studio-900 border border-studio-800 focus:border-electric-blue rounded p-2 text-xs text-slate-200 outline-none resize-none transition-colors"
                  />

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => speakText(scene.voiceoverScript || scene.subheading || scene.heading)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-studio-850 hover:bg-studio-800 text-slate-300 text-[11px] font-medium border border-studio-700 transition-colors"
                    >
                      <Play className="w-3 h-3 text-electric-blue" />
                      <span>Test Scene Speech</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

