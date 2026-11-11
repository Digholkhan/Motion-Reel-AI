import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIO_DIR = path.resolve(__dirname, '../../data/audio');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Generate a clean 16-bit PCM WAV buffer in pure JavaScript
function createWavBuffer({ durationSeconds = 30, sampleRate = 44100, generateSample }) {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const blockAlign = 2; // 1 channel, 16 bits = 2 bytes per sample
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample (16 bits)

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Fill PCM data
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generateSample(t, i, sampleRate)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

// Ensure default built-in atmospheric tracks exist
export function initDefaultAudioTracks() {
  const tracks = [
    {
      id: 'cyber-pulse',
      filename: 'cyber-pulse.wav',
      name: 'Cybernetic Pulse (Synthwave)',
      generator: (t) => {
        // Bass kick pulse every 0.5s + synth arpeggio + subtle sub bass
        const beat = (t % 0.5);
        const kick = Math.exp(-beat * 25) * Math.sin(2 * Math.PI * (60 - beat * 40) * beat);
        const chordNotes = [110, 130.81, 146.83, 164.81]; // A2, C3, D3, E3
        const noteIdx = Math.floor(t * 4) % chordNotes.length;
        const synthFreq = chordNotes[noteIdx];
        const synth = 0.25 * Math.sin(2 * Math.PI * synthFreq * t) * (1 - (t % 0.25) * 2);
        const sub = 0.15 * Math.sin(2 * Math.PI * 55 * t);
        return (kick * 0.4 + synth + sub) * 0.7;
      }
    },
    {
      id: 'future-flow',
      filename: 'future-flow.wav',
      name: 'Future Ambient Flow',
      generator: (t) => {
        // Warm ambient drone with gentle harmonic shimmer
        const pad1 = 0.2 * Math.sin(2 * Math.PI * 130.81 * t); // C3
        const pad2 = 0.2 * Math.sin(2 * Math.PI * 196.00 * t); // G3
        const pad3 = 0.15 * Math.sin(2 * Math.PI * 261.63 * t + Math.sin(t * 0.5)); // C4 vibrato
        const pulse = 0.1 * Math.sin(2 * Math.PI * 2 * t);
        return (pad1 + pad2 + pad3 + pulse) * 0.5;
      }
    },
    {
      id: 'tech-drive',
      filename: 'tech-drive.wav',
      name: 'High-Tech Momentum',
      generator: (t) => {
        // Energetic driving rhythm with crisp hi-hat tick
        const beat = (t % 0.25);
        const tick = (beat < 0.03) ? (Math.random() * 2 - 1) * Math.exp(-beat * 100) * 0.2 : 0;
        const bass = 0.3 * Math.sin(2 * Math.PI * 73.42 * t) * (1 - (t % 0.5));
        return tick + bass;
      }
    }
  ];

  for (const track of tracks) {
    const dest = path.join(AUDIO_DIR, track.filename);
    if (!fs.existsSync(dest)) {
      try {
        const buffer = createWavBuffer({
          durationSeconds: 60,
          sampleRate: 22050, // Compact 22kHz for fast generation
          generateSample: track.generator
        });
        fs.writeFileSync(dest, buffer);
        console.log(`[AudioGenerator] Generated built-in music track: ${track.name}`);
      } catch (err) {
        console.error(`[AudioGenerator] Failed to generate track ${track.id}:`, err);
      }
    }
  }
}

