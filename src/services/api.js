const API_BASE = '/api';

export const api = {
  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch projects');
    return data.projects || [];
  },

  async getProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch project');
    return data.project;
  },

  async saveProject(project) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save project');
    return data.project;
  },

  async duplicateProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to duplicate project');
    return data.project;
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete project');
    return true;
  },

  // AI Generation
  async generateScript(params) {
    const res = await fetch(`${API_BASE}/ai/script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate script');
    return data.scriptData;
  },

  async generateStoryboard(params) {
    const res = await fetch(`${API_BASE}/ai/storyboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate storyboard');
    return data.storyboard;
  },

  async regenerateScene(params) {
    const res = await fetch(`${API_BASE}/ai/regenerate-scene`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to regenerate scene');
    return data.scene;
  },

  async getAISettings() {
    const res = await fetch(`${API_BASE}/ai/settings`);
    const data = await res.json();
    return data.settings;
  },

  async updateAISettings(settings) {
    const res = await fetch(`${API_BASE}/ai/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    return data.settings;
  },

  // Voice & Audio
  async getVoices() {
    const res = await fetch(`${API_BASE}/voice/voices`);
    const data = await res.json();
    return data.voices || [];
  },

  async getMusicTracks() {
    const res = await fetch(`${API_BASE}/voice/music`);
    const data = await res.json();
    return data.tracks || [];
  },

  async uploadAudio(file) {
    const formData = new FormData();
    formData.append('audio', file);
    const res = await fetch(`${API_BASE}/voice/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload audio');
    return data;
  },

  // Remotion Rendering
  async startRender(project) {
    const res = await fetch(`${API_BASE}/render/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start render');
    return data.job;
  },

  async getRenderStatus(jobId) {
    const res = await fetch(`${API_BASE}/render/status/${jobId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch status');
    return data.job;
  },

  async getRenderHistory() {
    const res = await fetch(`${API_BASE}/render/history`);
    const data = await res.json();
    return data.renders || [];
  }
};

