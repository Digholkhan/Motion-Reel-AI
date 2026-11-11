import express from 'express';
import { projectStorage } from '../services/projectStorage.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const projects = projectStorage.getAllProjects();
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const project = projectStorage.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const projectData = req.body;
    if (!projectData.title) {
      return res.status(400).json({ success: false, error: 'Project title is required' });
    }
    const saved = projectStorage.saveProject(projectData);
    res.json({ success: true, project: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:id/duplicate', (req, res) => {
  try {
    const duplicated = projectStorage.duplicateProject(req.params.id);
    if (!duplicated) {
      return res.status(404).json({ success: false, error: 'Project not found to duplicate' });
    }
    res.json({ success: true, project: duplicated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleted = projectStorage.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

