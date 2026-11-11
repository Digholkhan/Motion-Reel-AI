import React, { useState, useEffect } from 'react';
import { useProject } from '../../store/ProjectContext';
import { api } from '../../services/api';
import {
  Clapperboard,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  HardDrive,
  FileVideo,
  Play,
  RotateCw
} from 'lucide-react';

export const RenderExport = () => {
  const { currentProject, renderJob, setRenderJob, showToast } = useProject();

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Poll render job status if active
  useEffect(() => {
    if (!renderJob || renderJob.status === 'completed' || renderJob.status === 'failed') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const updated = await api.getRenderStatus(renderJob.id);
        setRenderJob(updated);
        if (updated.status === 'completed') {
          showToast('MP4 video rendered successfully!', 'success');
          loadHistory();
        } else if (updated.status === 'failed') {
          showToast(`Render failed: ${updated.error || 'Unknown error'}`, 'error');
        }
      } catch (err) {
        console.error('Failed to poll render status:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [renderJob]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const list = await api.getRenderHistory();
      setHistory(list);
    } catch (err) {
      console.error('Failed to load render history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleStartRender = async () => {
    if (!currentProject) {
      showToast('No active project to render', 'warning');
      return;
    }

    try {
      showToast('Initiating Remotion render pipeline...', 'info');
      const job = await api.startRender(currentProject);
      setRenderJob(job);
    } catch (err) {
      console.error('Render trigger failed:', err);
      showToast(`Failed to trigger render: ${err.message}`, 'error');
    }
  };

  const isRendering = renderJob && (renderJob.status === 'bundling' || renderJob.status === 'rendering');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-electric-blue" />
          <span>Render & Export Studio</span>
        </h1>
        <p className="text-xs text-slate-400">
          Execute native server-side Remotion video rendering into H.264 MP4 with FFmpeg encoding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Render Job Status */}
        <div className="lg:col-span-7 bg-studio-900 border border-studio-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-studio-800">
            <div>
              <h3 className="text-sm font-bold text-white">Active Production Job</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentProject?.title || 'No Project Selected'}
              </p>
            </div>
            {renderJob && (
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  renderJob.status === 'completed'
                    ? 'border-electric-emerald text-electric-emerald bg-electric-emerald/10'
                    : renderJob.status === 'failed'
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-electric-blue text-electric-blue bg-electric-blue/10 animate-pulse'
                }`}
              >
                {renderJob.status}
              </span>
            )}
          </div>

          {/* Progress Bar & Status Details */}
          {renderJob ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">
                    {renderJob.status === 'bundling'
                      ? 'Bundling Remotion Webpack Assets...'
                      : renderJob.status === 'rendering'
                      ? `Rendering Frames: ${renderJob.renderedFrames || 0} / ${renderJob.totalFrames || 0}`
                      : renderJob.status === 'completed'
                      ? 'MP4 Render Complete'
                      : 'Render Halted'}
                  </span>
                  <span className="font-bold text-electric-blue">{renderJob.progress || 0}%</span>
                </div>

                <div className="h-3 w-full bg-studio-950 rounded-full overflow-hidden p-0.5 border border-studio-800">
                  <div
                    style={{ width: `${renderJob.progress || 0}%` }}
                    className="h-full bg-gradient-to-r from-electric-blue to-electric-purple rounded-full transition-all duration-300 shadow-glow-blue"
                  />
                </div>
              </div>

              {/* Rendering Pipeline Stages */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                <div
                  className={`p-2 rounded border text-center ${
                    renderJob.progress >= 15
                      ? 'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                      : 'border-studio-800 bg-studio-950 text-slate-500'
                  }`}
                >
                  1. Webpack Bundle
                </div>
                <div
                  className={`p-2 rounded border text-center ${
                    renderJob.progress >= 95
                      ? 'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                      : renderJob.progress >= 15
                      ? 'border-electric-purple/40 bg-electric-purple/10 text-electric-purple animate-pulse'
                      : 'border-studio-800 bg-studio-950 text-slate-500'
                  }`}
                >
                  2. Headless Chromium
                </div>
                <div
                  className={`p-2 rounded border text-center ${
                    renderJob.status === 'completed'
                      ? 'border-electric-emerald/40 bg-electric-emerald/10 text-electric-emerald'
                      : 'border-studio-800 bg-studio-950 text-slate-500'
                  }`}
                >
                  3. FFmpeg H.264
                </div>
              </div>

              {/* Error Message if Failed */}
              {renderJob.status === 'failed' && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold">Render Pipeline Error:</div>
                    <div className="font-mono text-[11px]">{renderJob.error}</div>
                  </div>
                </div>
              )}

              {/* Download Action if Complete */}
              {renderJob.status === 'completed' && (
                <div className="p-4 rounded-xl bg-studio-950 border border-electric-emerald/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-electric-emerald flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Video Ready for Download</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {renderJob.outputFilename}
                      </div>
                    </div>
                  </div>

                  <a
                    href={renderJob.downloadUrl}
                    download={renderJob.outputFilename}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric-emerald hover:bg-emerald-600 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-studio-800 rounded-xl text-center space-y-2">
              <Clapperboard className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                No active render job. Click below to begin rendering the current composition.
              </p>
            </div>
          )}

          {/* Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleStartRender}
              disabled={isRendering || !currentProject}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-electric-blue to-electric-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-bold shadow-glow-blue transition-all disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Remotion Video Pipeline...</span>
                </>
              ) : (
                <>
                  <Clapperboard className="w-4 h-4" />
                  <span>Execute MP4 Render ({currentProject?.aspectRatio || '16:9'} • {currentProject?.fps || 30} FPS)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Render History */}
        <div className="lg:col-span-5 bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-electric-cyan" />
                <h3 className="text-sm font-bold text-white">Render Archive</h3>
              </div>
              <button
                onClick={loadHistory}
                className="p-1 rounded hover:bg-studio-800 text-slate-400 hover:text-white"
                title="Refresh history"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {loadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-electric-blue" />
                  <span>Scanning local renders...</span>
                </div>
              ) : history.length > 0 ? (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-studio-950 border border-studio-800 hover:border-studio-700 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileVideo className="w-5 h-5 text-electric-blue flex-shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {item.filename}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.sizeMb} MB • {new Date(item.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      download={item.filename}
                      className="p-2 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 hover:text-white border border-studio-750 transition-colors flex-shrink-0"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  No rendered MP4 videos yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

