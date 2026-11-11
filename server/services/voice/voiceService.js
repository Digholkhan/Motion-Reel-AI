import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDefaultAudioTracks } from './audioGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIO_DIR = path.resolve(__dirname, '../../data/audio');

initDefaultAudioTracks();

export const voiceService = {
  getAvailableVoices() {
    return [
      { id: 'en-US-GuyNeural', name: 'Guy (Energetic & Confident)', lang: 'en-US', gender: 'male', provider: 'browser' },
      { id: 'en-US-JennyNeural', name: 'Jenny (Clear & Professional)', lang: 'en-US', gender: 'female', provider: 'browser' },
      { id: 'en-US-AriaNeural', name: 'Aria (Dynamic Storyteller)', lang: 'en-US', gender: 'female', provider: 'browser' },
      { id: 'en-US-DavisNeural', name: 'Davis (Deep Cinematic)', lang: 'en-US', gender: 'male', provider: 'browser' },
      { id: 'en-GB-RyanNeural', name: 'Ryan (British Tech)', lang: 'en-GB', gender: 'male', provider: 'browser' }
    ];
  },

  getAvailableMusicTracks() {
    return [
      { id: 'cyber-pulse', name: 'Cybernetic Pulse (Synthwave)', url: '/api/voice/audio/cyber-pulse.wav', tempo: '128 BPM', mood: 'Energetic / Tech' },
      { id: 'future-flow', name: 'Future Ambient Flow', url: '/api/voice/audio/future-flow.wav', tempo: '90 BPM', mood: 'Smooth / Cinematic' },
      { id: 'tech-drive', name: 'High-Tech Momentum', url: '/api/voice/audio/tech-drive.wav', tempo: '135 BPM', mood: 'Urgent / Dynamic' }
    ];
  },

  getAudioFilePath(filename) {
    const safeName = path.basename(filename);
    const fullPath = path.join(AUDIO_DIR, safeName);
    return fs.existsSync(fullPath) ? fullPath : null;
  }
};

