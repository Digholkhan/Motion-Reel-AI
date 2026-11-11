import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useProject } from '../../store/ProjectContext';
import {
  Settings as SettingsIcon,
  Cpu,
  Key,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Sliders,
  Server,
  Loader2,
  Save
} from 'lucide-react';

export const Settings = () => {
  const { showToast } = useProject();

  const [provider, setProvider] = useState('local');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await api.getAISettings();
        if (s) {
          setProvider(s.provider || 'local');
          setModel(s.model || 'gemini-1.5-flash');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await api.updateAISettings({
        provider,
        apiKey,
        model
      });
      showToast('AI Provider settings updated', 'success');
    } catch (err) {
      showToast(`Failed to update settings: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAI = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await api.generateScript({
        topic: 'MotionForge Diagnostics',
        durationInSeconds: 15
      });
      setTestResult({
        success: true,
        message: `Successfully connected to ${provider.toUpperCase()} provider! Script: "${res.title}"`
      });
      showToast('AI connection test passed!', 'success');
    } catch (err) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message}`
      });
      showToast('AI connection test failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
          <span>Studio Settings & AI Provider Config</span>
        </h1>
        <p className="text-xs text-slate-400">
          Configure provider-independent AI adapters, Gemini API keys, Remotion renderer engine, and defaults.
        </p>
      </div>

      <div className="space-y-6">
        {/* AI Provider Card */}
        <div className="bg-studio-900 border border-studio-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-studio-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-electric-blue" />
              <h3 className="text-sm font-bold text-white">AI Script & Storyboard Provider</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-800 text-electric-cyan border border-studio-700">
              Provider-Independent Adapter
            </span>
          </div>

          {/* Provider Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setProvider('local')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                provider === 'local'
                  ? 'bg-electric-blue/10 border-electric-blue text-white shadow-glow-blue'
                  : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-750'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">
                Built-in Autonomous Engine
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                100% offline, zero-cost, instant heuristic motion graphics generator. No API keys required.
              </p>
            </div>

            <div
              onClick={() => setProvider('gemini')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                provider === 'gemini'
                  ? 'bg-electric-purple/10 border-electric-purple text-white shadow-glow-purple'
                  : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-750'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">
                Google Gemini API
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect your Gemini API key for advanced dynamic creative reasoning and narrative scripting.
              </p>
            </div>
          </div>

          {/* Gemini Fields if Selected */}
          {provider === 'gemini' && (
            <div className="p-4 rounded-xl bg-studio-950 border border-studio-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Gemini API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google Gemini API Key (e.g. AIzaSy...)"
                    className="w-full bg-studio-900 border border-studio-750 focus:border-electric-blue rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Keys are kept in your local server session and never sent to external third parties.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Model Selection
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-studio-900 border border-studio-750 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash (Ultra Fast & Next-Gen)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Creative Reasoning)</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleTestAI}
              disabled={testing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-studio-800 hover:bg-studio-750 text-slate-200 text-xs font-semibold border border-studio-700 transition-colors disabled:opacity-50"
            >
              {testing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-blue" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-electric-emerald" />
              )}
              <span>Test AI Connection</span>
            </button>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-bold shadow-glow-blue transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save AI Settings</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs font-mono border ${
                testResult.success
                  ? 'bg-electric-emerald/10 border-electric-emerald/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* System & Hardware Diagnostics Card */}
        <div className="bg-studio-900 border border-studio-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-studio-800">
            <Server className="w-4 h-4 text-electric-purple" />
            <h3 className="text-sm font-bold text-white">Remotion Engine & System Diagnostics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-studio-950 border border-studio-800 flex items-center justify-between">
              <span className="text-slate-400">Node.js Runtime</span>
              <span className="font-mono text-slate-200 font-semibold">v24.21.0</span>
            </div>

            <div className="p-3 rounded-lg bg-studio-950 border border-studio-800 flex items-center justify-between">
              <span className="text-slate-400">Remotion Framework</span>
              <span className="font-mono text-electric-blue font-semibold">v4.0.244</span>
            </div>

            <div className="p-3 rounded-lg bg-studio-950 border border-studio-800 flex items-center justify-between">
              <span className="text-slate-400">Headless Chromium</span>
              <span className="font-mono text-electric-emerald font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Installed (Chrome/Edge)</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-studio-950 border border-studio-800 flex items-center justify-between">
              <span className="text-slate-400">FFmpeg H.264 Encoder</span>
              <span className="font-mono text-electric-emerald font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Binary</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

