import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GeminiAdapter } from './geminiAdapter.js';
import { LocalHeuristicAdapter } from './localHeuristicAdapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE = path.resolve(__dirname, '../../data/.ai_config.json');

let activeConfig = {
  provider: 'local',
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-1.5-flash'
};

// Load saved config if exists
if (fs.existsSync(CONFIG_FILE)) {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const saved = JSON.parse(raw);
    activeConfig = {
      ...activeConfig,
      provider: saved.provider || activeConfig.provider,
      apiKey: saved.apiKey || activeConfig.apiKey,
      model: saved.model || activeConfig.model
    };
  } catch (err) {
    console.error('Failed to load .ai_config.json:', err.message);
  }
}

export function updateAISettings(config) {
  activeConfig = {
    ...activeConfig,
    provider: config.provider !== undefined ? config.provider : activeConfig.provider,
    apiKey: config.apiKey !== undefined && config.apiKey.trim() !== '' ? config.apiKey.trim() : activeConfig.apiKey,
    model: config.model !== undefined ? config.model : activeConfig.model
  };

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      provider: activeConfig.provider,
      apiKey: activeConfig.apiKey,
      model: activeConfig.model
    }, null, 2));
  } catch (err) {
    console.error('Failed to persist .ai_config.json:', err.message);
  }

  console.log('[AIService] Updated AI configuration:', {
    provider: activeConfig.provider,
    model: activeConfig.model,
    hasKey: Boolean(activeConfig.apiKey)
  });
}

// Strictly returns sanitized information — NEVER returns the raw API key!
export function getAISettings() {
  return {
    provider: activeConfig.provider,
    model: activeConfig.model,
    hasKey: Boolean(activeConfig.apiKey)
  };
}

export function getAIAdapter() {
  if (activeConfig.provider === 'gemini') {
    return new GeminiAdapter(activeConfig.apiKey, activeConfig.model);
  }
  return new LocalHeuristicAdapter();
}
