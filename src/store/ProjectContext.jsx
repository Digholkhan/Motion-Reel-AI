import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [renderJob, setRenderJob] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === prev?.id ? null : prev));
    }, 4000);
  };

  // Load projects from backend on mount
  const loadProjects = async () => {
    try {
      setLoading(true);
      const list = await api.getProjects();
      setProjects(list);
      if (list.length > 0 && !currentProject) {
        setCurrentProject(list[0]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      showToast('Error connecting to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Update specific field in current project
  const updateProjectField = (field, value) => {
    setCurrentProject(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  // Update a specific scene
  const updateScene = (sceneIndex, updatedScene) => {
    setCurrentProject(prev => {
      if (!prev || !prev.scenes) return prev;
      const newScenes = [...prev.scenes];
      newScenes[sceneIndex] = { ...newScenes[sceneIndex], ...updatedScene };
      return { ...prev, scenes: newScenes };
    });
  };

  // Add a new scene
  const addScene = (sceneData = {}) => {
    setCurrentProject(prev => {
      if (!prev) return prev;
      const currentScenes = prev.scenes || [];
      const newScene = {
        id: `scene-${Date.now()}`,
        order: currentScenes.length,
        durationInSeconds: 5,
        archetype: 'KINETIC_TITLE',
        heading: 'NEW SCENE',
        subheading: 'Add your motion graphics content here',
        badge: '⚡ SCENE ' + (currentScenes.length + 1),
        caption: `Scene ${currentScenes.length + 1}`,
        metrics: [],
        features: [],
        layout: 'center',
        motionPreset: 'energetic',
        colorPalette: {
          bg: '#070B14',
          accent: prev.theme?.primaryColor || '#3B82F6',
          textPrimary: '#FFFFFF',
          textSecondary: '#94A3B8',
          glow: 'rgba(59, 130, 246, 0.5)'
        },
        transition: { type: 'zoom', durationInFrames: 15 },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' },
        voiceoverScript: '',
        ...sceneData
      };
      return { ...prev, scenes: [...currentScenes, newScene] };
    });
    showToast('New scene added to storyboard', 'success');
  };

  // Delete scene
  const deleteScene = (index) => {
    setCurrentProject(prev => {
      if (!prev || !prev.scenes || prev.scenes.length <= 1) {
        showToast('At least one scene is required in the timeline', 'warning');
        return prev;
      }
      const newScenes = prev.scenes.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
      if (activeSceneIndex >= newScenes.length) {
        setActiveSceneIndex(Math.max(0, newScenes.length - 1));
      }
      return { ...prev, scenes: newScenes };
    });
    showToast('Scene removed', 'info');
  };

  // Reorder scene
  const moveScene = (index, direction) => {
    setCurrentProject(prev => {
      if (!prev || !prev.scenes) return prev;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.scenes.length) return prev;

      const newScenes = [...prev.scenes];
      const temp = newScenes[index];
      newScenes[index] = newScenes[targetIndex];
      newScenes[targetIndex] = temp;

      // Re-assign order
      const reindexed = newScenes.map((s, i) => ({ ...s, order: i }));
      setActiveSceneIndex(targetIndex);
      return { ...prev, scenes: reindexed };
    });
  };

  // Save current project to backend
  const saveCurrentProject = async () => {
    if (!currentProject) return;
    try {
      setSaving(true);
      const saved = await api.saveProject(currentProject);
      setCurrentProject(saved);
      // Update in list
      setProjects(prev => {
        const exists = prev.some(p => p.id === saved.id);
        if (exists) {
          return prev.map(p => (p.id === saved.id ? saved : p));
        }
        return [saved, ...prev];
      });
      showToast('Project saved successfully', 'success');
      return saved;
    } catch (err) {
      console.error('Save failed:', err);
      showToast(`Save failed: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        activeModule,
        setActiveModule,
        activeSceneIndex,
        setActiveSceneIndex,
        loading,
        saving,
        toastMessage,
        showToast,
        renderJob,
        setRenderJob,
        loadProjects,
        updateProjectField,
        updateScene,
        addScene,
        deleteScene,
        moveScene,
        saveCurrentProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

