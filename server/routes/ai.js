import express from 'express';
import { getAIAdapter, getAISettings, updateAISettings } from '../services/ai/index.js';
import { validateStoryboardData, validateSceneData } from '../schemas/storyboardSchema.js';

const router = express.Router();

router.get('/settings', (req, res) => {
  res.json({ success: true, settings: getAISettings() });
});

router.post('/settings', (req, res) => {
  try {
    const { provider, apiKey, model } = req.body;
    updateAISettings({ provider, apiKey, model });
    res.json({ success: true, settings: getAISettings() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/script', async (req, res) => {
  try {
    const { topic, tone, targetAudience, durationInSeconds, language } = req.body;
    const adapter = getAIAdapter();
    const result = await adapter.generateScript({
      topic: topic || 'Next-Gen Motion Graphics',
      tone: tone || 'energetic',
      targetAudience: targetAudience || 'creators',
      durationInSeconds: Number(durationInSeconds) || 30,
      language: language || 'en'
    });
    res.json({ success: true, scriptData: result });
  } catch (err) {
    console.error('AI Script generation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/storyboard', async (req, res) => {
  try {
    const { script, topic, durationInSeconds, language, style } = req.body;
    const adapter = getAIAdapter();
    const result = await adapter.generateStoryboard({
      script: script || '',
      topic: topic || 'Motion Reel',
      durationInSeconds: Number(durationInSeconds) || 30,
      language: language || 'en',
      style: style || 'cyber'
    });

    // Validate with Zod
    const validated = validateStoryboardData(result);
    res.json({ success: true, storyboard: validated });
  } catch (err) {
    console.error('AI Storyboard generation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/regenerate-scene', async (req, res) => {
  try {
    const { currentScene, instruction } = req.body;
    if (!currentScene) {
      return res.status(400).json({ success: false, error: 'currentScene is required' });
    }
    const adapter = getAIAdapter();
    const updatedScene = await adapter.regenerateScene({ currentScene, instruction });
    const validated = validateSceneData(updatedScene);
    res.json({ success: true, scene: validated });
  } catch (err) {
    console.error('AI Scene regeneration failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
