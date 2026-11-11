import React, { useState, useRef } from 'react';
import { useProject } from '../../store/ProjectContext';
import { api } from '../../services/api';
import {
  FolderGit2,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Search,
  Clock,
  Film,
  Sparkles,
  PlaySquare,
  CheckCircle2
} from 'lucide-react';

export const ProjectLibrary = () => {
  const {
    projects,
    currentProject,
    setCurrentProject,
    setActiveModule,
    loadProjects,
    showToast
  } = useProject();

  const [search, setSearch] = useState('');
  const importInputRef = useRef(null);

  const filtered = projects.filter((p) =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.topic || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenProject = (proj) => {
    setCurrentProject(proj);
    showToast(`Loaded project "${proj.title}"`, 'info');
    setActiveModule('preview-studio');
  };

  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      showToast('Duplicating project...', 'info');
      await api.duplicateProject(id);
      await loadProjects();
      showToast('Project duplicated successfully', 'success');
    } catch (err) {
      showToast(`Duplicate failed: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, title, e) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteProject(id);
      await loadProjects();
      showToast('Project deleted', 'info');
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const handleExportJson = (proj, e) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${proj.id || 'project'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Project JSON exported', 'success');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (!parsed.title) {
          throw new Error('Invalid project file format (missing title)');
        }
        parsed.id = `proj-imported-${Date.now()}`;
        const saved = await api.saveProject(parsed);
        await loadProjects();
        setCurrentProject(saved);
        showToast('Project imported and loaded!', 'success');
        setActiveModule('preview-studio');
      } catch (err) {
        showToast(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Hidden file input for import */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJson}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-electric-blue" />
            <span>Project Library</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage, duplicate, import, and archive your local JSON motion reels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 text-xs font-semibold border border-studio-750 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-electric-purple" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => setActiveModule('new-project')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Reel</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects by title or topic..."
          className="w-full bg-studio-900 border border-studio-800 focus:border-electric-blue rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-colors"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => {
          const isCurrent = currentProject?.id === proj.id;
          const scenesCount = proj.scenes?.length || 0;
          const totalSecs = (proj.scenes || []).reduce((acc, s) => acc + (s.durationInSeconds || 5), 0) || proj.durationInSeconds || 30;

          return (
            <div
              key={proj.id}
              onClick={() => handleOpenProject(proj)}
              className={`bg-studio-900 border rounded-xl p-5 cursor-pointer flex flex-col justify-between space-y-4 transition-all group ${
                isCurrent
                  ? 'border-electric-blue/60 shadow-glow-blue'
                  : 'border-studio-800 hover:border-studio-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-studio-950 text-electric-cyan border border-studio-800">
                      {proj.aspectRatio || '16:9'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-studio-950 text-slate-400 border border-studio-800">
                      {proj.fps || 30} FPS
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-electric-blue bg-electric-blue/10 px-2 py-0.5 rounded-full border border-electric-blue/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors truncate">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {proj.topic || 'Dynamic Remotion Composition'}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Film className="w-3 h-3 text-electric-purple" />
                    <span>{scenesCount} scenes</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-electric-blue" />
                    <span>{totalSecs}s</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-studio-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDuplicate(proj.id, e)}
                    className="p-1.5 rounded-lg bg-studio-950 hover:bg-studio-800 text-slate-400 hover:text-white border border-studio-800 transition-colors"
                    title="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleExportJson(proj, e)}
                    className="p-1.5 rounded-lg bg-studio-950 hover:bg-studio-800 text-slate-400 hover:text-white border border-studio-800 transition-colors"
                    title="Export JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(proj.id, proj.title, e)}
                    className="p-1.5 rounded-lg bg-studio-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-studio-800 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-electric-blue group-hover:translate-x-1 transition-transform">
                  <span>Open Studio</span>
                  <PlaySquare className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

