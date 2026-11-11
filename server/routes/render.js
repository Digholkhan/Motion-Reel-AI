import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { renderService } from '../services/remotion/renderService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RENDERS_DIR = path.resolve(__dirname, '../data/renders');

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const { project } = req.body;
    if (!project || !project.id) {
      return res.status(400).json({ success: false, error: 'Valid project object is required' });
    }
    const job = await renderService.startRenderJob(project);
    res.json({ success: true, job });
  } catch (err) {
    console.error('Failed to trigger render:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/status/:jobId', (req, res) => {
  const job = renderService.getJobStatus(req.params.jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }
  res.json({ success: true, job });
});

router.get('/history', (req, res) => {
  try {
    const renders = renderService.getAllRenders();
    res.json({ success: true, renders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/download/:filename', (req, res) => {
  const safeName = path.basename(req.params.filename);
  const fullPath = path.join(RENDERS_DIR, safeName);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('Rendered video not found');
  }
  res.download(fullPath, safeName);
});

export default router;

