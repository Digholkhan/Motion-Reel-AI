import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { voiceService } from '../services/voice/voiceService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIO_DIR = path.resolve(__dirname, '../data/audio');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AUDIO_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.mp3';
    cb(null, `uploaded-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
});

router.get('/voices', (req, res) => {
  res.json({ success: true, voices: voiceService.getAvailableVoices() });
});

router.get('/music', (req, res) => {
  res.json({ success: true, tracks: voiceService.getAvailableMusicTracks() });
});

router.get('/audio/:filename', (req, res) => {
  const filePath = voiceService.getAudioFilePath(req.params.filename);
  if (!filePath) {
    return res.status(404).send('Audio file not found');
  }
  res.sendFile(filePath);
});

router.post('/upload', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio file provided' });
    }
    const publicUrl = `/api/voice/audio/${req.file.filename}`;
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: publicUrl,
      sizeBytes: req.file.size
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

