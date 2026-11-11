import { z } from 'zod';

export const AspectRatioSchema = z.enum(['16:9', '9:16', '1:1']);
export const FpsSchema = z.union([z.literal(24), z.literal(30), z.literal(60)]);
export const LanguageSchema = z.enum(['en', 'bn']).default('en');

export const SceneArchetypeSchema = z.enum([
  'KINETIC_TITLE',
  'METRIC_COUNTER',
  'FEATURE_CARDS',
  'TECH_HUD',
  'ISOMETRIC_BADGE',
  'CALL_TO_ACTION'
]);

export const TransitionTypeSchema = z.enum([
  'zoom',
  'wipe',
  'slide',
  'fade',
  'glitch'
]);

export const BackgroundStyleSchema = z.enum([
  'matrix-grid',
  'cyber-haze',
  'gradient-drift',
  'particle-field',
  'dark-minimal',
  'hud-grid',
  'deep-navy'
]).default('matrix-grid');

export const MotionPresetSchema = z.enum([
  'energetic',
  'smooth',
  'cyber',
  'minimal',
  'dramatic'
]);

export const MetricItemSchema = z.object({
  label: z.string().default('Growth'),
  value: z.string().default('99%'),
  targetNumber: z.number().default(99),
  suffix: z.string().default('%'),
  prefix: z.string().default('')
});

export const FeatureItemSchema = z.object({
  title: z.string().default('Feature'),
  description: z.string().default('High performance capability'),
  icon: z.string().default('zap')
});

export const OnScreenTextSchema = z.object({
  heading: z.string().default(''),
  subheading: z.string().optional().default(''),
  badge: z.string().optional().default('')
});

export const SceneSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
  startTime: z.number().min(0).default(0),
  durationInSeconds: z.number().min(1).max(30).default(5),
  
  // Voice & Narration
  voiceoverText: z.string().default(''),
  voiceoverScript: z.string().optional().default(''), // Backward compatibility alias
  
  // On-Screen Typography
  onScreenText: OnScreenTextSchema.default({ heading: '', subheading: '', badge: '' }),
  heading: z.string().default('Headline'),
  subheading: z.string().optional().default(''),
  badge: z.string().optional().default(''),
  caption: z.string().optional().default(''),
  emphasizedKeywords: z.array(z.string()).default([]),

  // Art Direction & Motion Design
  visualDescription: z.string().default(''),
  animationInstructions: z.string().default(''),
  transitionType: TransitionTypeSchema.default('zoom'),
  backgroundStyle: BackgroundStyleSchema.default('matrix-grid'),
  soundEffectSuggestions: z.array(z.string()).default([]),

  // Composition Archetype & Content
  archetype: SceneArchetypeSchema.default('KINETIC_TITLE'),
  metrics: z.array(MetricItemSchema).optional().default([]),
  features: z.array(FeatureItemSchema).optional().default([]),
  layout: z.enum(['center', 'split-left', 'split-right', 'minimal', 'hud-frame']).default('center'),
  motionPreset: MotionPresetSchema.default('energetic'),
  
  colorPalette: z.object({
    bg: z.string().default('#0B0F19'),
    textPrimary: z.string().default('#FFFFFF'),
    textSecondary: z.string().default('#94A3B8'),
    accent: z.string().default('#3B82F6'),
    glow: z.string().default('rgba(59, 130, 246, 0.5)')
  }).default({
    bg: '#0B0F19',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    accent: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.5)'
  }),

  transition: z.object({
    type: TransitionTypeSchema.default('zoom'),
    durationInFrames: z.number().int().default(15)
  }).default({
    type: 'zoom',
    durationInFrames: 15
  }),

  visualElements: z.object({
    showGrid: z.boolean().default(true),
    showParticles: z.boolean().default(true),
    showOrb: z.boolean().default(true),
    shapeType: z.enum(['circles', 'hexagons', 'cubes', 'lines', 'none']).default('circles')
  }).default({
    showGrid: true,
    showParticles: true,
    showOrb: true,
    shapeType: 'circles'
  })
});

export const StoryboardSchema = z.object({
  topic: z.string().default(''),
  language: LanguageSchema.default('en'),
  totalDurationInSeconds: z.number().min(1).default(30),
  sceneCount: z.number().int().min(1).default(5),
  scenes: z.array(SceneSchema)
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  topic: z.string().default(''),
  language: LanguageSchema.default('en'),
  aspectRatio: AspectRatioSchema.default('16:9'),
  fps: FpsSchema.default(30),
  durationInSeconds: z.number().min(10).max(120).default(30),
  theme: z.object({
    preset: z.string().default('electric-blue'),
    primaryColor: z.string().default('#3B82F6'),
    secondaryColor: z.string().default('#8B5CF6'),
    bgColor: z.string().default('#070B14'),
    fontHeading: z.string().default('Space Grotesk'),
    fontBody: z.string().default('Inter')
  }).default({
    preset: 'electric-blue',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    bgColor: '#070B14',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter'
  }),
  voice: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['browser', 'edge-tts', 'custom', 'none']).default('browser'),
    voiceId: z.string().default('en-US-GuyNeural'),
    rate: z.number().default(1.0),
    pitch: z.number().default(1.0),
    volume: z.number().default(1.0),
    audioUrl: z.string().nullable().default(null)
  }).default({
    enabled: true,
    provider: 'browser',
    voiceId: 'en-US-GuyNeural',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    audioUrl: null
  }),
  music: z.object({
    enabled: z.boolean().default(true),
    trackId: z.string().default('cyber-pulse'),
    trackName: z.string().default('Cybernetic Pulse (Synthwave)'),
    volume: z.number().default(0.25),
    audioUrl: z.string().nullable().default(null)
  }).default({
    enabled: true,
    trackId: 'cyber-pulse',
    trackName: 'Cybernetic Pulse (Synthwave)',
    volume: 0.25,
    audioUrl: null
  }),
  scenes: z.array(SceneSchema).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString())
});

export const AspectRatioDimensions = {
  '16:9': { width: 1920, height: 1080, label: '16:9 Landscape (YouTube, Web)' },
  '9:16': { width: 1080, height: 1920, label: '9:16 Vertical (Reels, TikTok, Shorts)' },
  '1:1': { width: 1080, height: 1080, label: '1:1 Square (Instagram, Feed)' }
};
