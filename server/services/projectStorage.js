import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECTS_DIR = path.resolve(__dirname, '../data/projects');

// Ensure directory exists
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

// Seed starter demo project if empty
function seedDefaultProjectsIfEmpty() {
  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    const starterProject = {
      id: 'motion-forge-genesis',
      title: 'MotionForge AI: The Future of Dynamic Motion',
      topic: 'AI Motion Graphics Studio',
      aspectRatio: '16:9',
      fps: 30,
      durationInSeconds: 25,
      theme: {
        preset: 'electric-blue',
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        bgColor: '#070B14',
        fontHeading: 'Space Grotesk',
        fontBody: 'Inter'
      },
      voice: {
        enabled: true,
        provider: 'browser',
        voiceId: 'en-US-GuyNeural',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        audioUrl: null
      },
      music: {
        enabled: true,
        trackId: 'cyber-pulse',
        trackName: 'Cybernetic Pulse (Synthwave)',
        volume: 0.25,
        audioUrl: null
      },
      scenes: [
        {
          id: 'scene-1',
          order: 0,
          durationInSeconds: 5,
          archetype: 'KINETIC_TITLE',
          heading: 'MOTIONFORGE AI',
          subheading: 'NEXT-GENERATION PROCEDURAL MOTION DESIGN',
          badge: '⚡ AUTONOMOUS TIMELINE ENGINE',
          caption: 'Scene 1 • Kinetic Title',
          metrics: [],
          features: [],
          layout: 'center',
          motionPreset: 'energetic',
          colorPalette: {
            bg: '#070B14',
            textPrimary: '#FFFFFF',
            textSecondary: '#94A3B8',
            accent: '#3B82F6',
            glow: 'rgba(59, 130, 246, 0.5)'
          },
          transition: { type: 'zoom', durationInFrames: 15 },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' },
          voiceoverScript: 'Welcome to MotionForge AI. The future of autonomous motion graphics production.'
        },
        {
          id: 'scene-2',
          order: 1,
          durationInSeconds: 5,
          archetype: 'TECH_HUD',
          heading: 'FRAME-ACCURATE CHOREOGRAPHY',
          subheading: 'Sub-pixel vector curves and dynamic SVG synthesis',
          badge: 'SYSTEM ACTIVE // 60 FPS',
          caption: 'Scene 2 • Tech HUD',
          metrics: [],
          features: [],
          layout: 'hud-frame',
          motionPreset: 'cyber',
          colorPalette: {
            bg: '#080D1A',
            textPrimary: '#FFFFFF',
            textSecondary: '#60A5FA',
            accent: '#06B6D4',
            glow: 'rgba(6, 182, 212, 0.4)'
          },
          transition: { type: 'wipe', durationInFrames: 15 },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'hexagons' },
          voiceoverScript: 'Every frame is calculated with mathematical precision and synchronized audio.'
        },
        {
          id: 'scene-3',
          order: 2,
          durationInSeconds: 5,
          archetype: 'METRIC_COUNTER',
          heading: 'BENCHMARK ADVANTAGE',
          subheading: 'Drastically shorten time-to-render without sacrificing quality',
          badge: 'PRODUCTION GAINS',
          caption: 'Scene 3 • Metric Counter',
          metrics: [
            { label: 'RENDER SPEED', value: '10x', targetNumber: 10, suffix: 'x', prefix: '' },
            { label: 'ENGAGEMENT', value: '88%', targetNumber: 88, suffix: '%', prefix: '+' },
            { label: 'NATIVE FPS', value: '60', targetNumber: 60, suffix: ' fps', prefix: '' }
          ],
          features: [],
          layout: 'split-left',
          motionPreset: 'dramatic',
          colorPalette: {
            bg: '#0A0E1D',
            textPrimary: '#FFFFFF',
            textSecondary: '#CBD5E1',
            accent: '#8B5CF6',
            glow: 'rgba(139, 92, 246, 0.45)'
          },
          transition: { type: 'slide', durationInFrames: 15 },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' },
          voiceoverScript: 'Produce at 10x speed with 88% higher retention across social platforms.'
        },
        {
          id: 'scene-4',
          order: 3,
          durationInSeconds: 5,
          archetype: 'FEATURE_CARDS',
          heading: 'OMNICHANNEL READY',
          subheading: 'Instant formatting for YouTube, Instagram Reels, and TikTok',
          badge: 'MULTI-ASPECT RATIOS',
          caption: 'Scene 4 • Feature Cards',
          metrics: [],
          features: [
            { title: '16:9 Landscape', description: 'Cinema & YouTube presentations', icon: 'monitor' },
            { title: '9:16 Vertical', description: 'High-converting TikTok & Reels', icon: 'smartphone' },
            { title: '1:1 Square', description: 'Universal social feed square', icon: 'square' }
          ],
          layout: 'center',
          motionPreset: 'smooth',
          colorPalette: {
            bg: '#070B14',
            textPrimary: '#FFFFFF',
            textSecondary: '#94A3B8',
            accent: '#3B82F6',
            glow: 'rgba(59, 130, 246, 0.4)'
          },
          transition: { type: 'zoom', durationInFrames: 15 },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'lines' },
          voiceoverScript: 'Adapt your narrative to any screen ratio with a single click.'
        },
        {
          id: 'scene-5',
          order: 4,
          durationInSeconds: 5,
          archetype: 'CALL_TO_ACTION',
          heading: 'BUILD YOUR MOTION REEL',
          subheading: 'Launch your high-impact video now on MotionForge AI',
          badge: 'READY TO RENDER',
          caption: 'Scene 5 • Call to Action',
          metrics: [],
          features: [],
          layout: 'center',
          motionPreset: 'energetic',
          colorPalette: {
            bg: '#0B0F19',
            textPrimary: '#FFFFFF',
            textSecondary: '#A78BFA',
            accent: '#8B5CF6',
            glow: 'rgba(139, 92, 246, 0.6)'
          },
          transition: { type: 'fade', durationInFrames: 15 },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' },
          voiceoverScript: 'MotionForge AI: where imagination becomes kinetic reality.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(PROJECTS_DIR, `${starterProject.id}.json`),
      JSON.stringify(starterProject, null, 2)
    );
  }
}

seedDefaultProjectsIfEmpty();

export const projectStorage = {
  getAllProjects() {
    try {
      const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
      const projects = files.map(file => {
        try {
          const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8');
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (err) {
      console.error('Error listing projects:', err);
      return [];
    }
  },

  getProjectById(id) {
    const filePath = path.join(PROJECTS_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error reading project ${id}:`, err);
      return null;
    }
  },

  saveProject(project) {
    const id = project.id || `proj-${Date.now()}`;
    const toSave = {
      ...project,
      id,
      updatedAt: new Date().toISOString()
    };
    const filePath = path.join(PROJECTS_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(toSave, null, 2));
    return toSave;
  },

  duplicateProject(id) {
    const original = this.getProjectById(id);
    if (!original) return null;

    const newId = `proj-${Date.now()}`;
    const duplicated = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.saveProject(duplicated);
  },

  deleteProject(id) {
    const filePath = path.join(PROJECTS_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
};

