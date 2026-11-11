import { z } from 'zod';

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

export const ServerSceneSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
  startTime: z.number().min(0).default(0),
  durationInSeconds: z.number().min(1).max(30).default(5),
  voiceoverText: z.string().default(''),
  voiceoverScript: z.string().optional().default(''),
  onScreenText: OnScreenTextSchema.default({ heading: '', subheading: '', badge: '' }),
  heading: z.string().default('Headline'),
  subheading: z.string().optional().default(''),
  badge: z.string().optional().default(''),
  caption: z.string().optional().default(''),
  emphasizedKeywords: z.array(z.string()).default([]),
  visualDescription: z.string().default(''),
  animationInstructions: z.string().default(''),
  transitionType: TransitionTypeSchema.default('zoom'),
  backgroundStyle: BackgroundStyleSchema.default('matrix-grid'),
  soundEffectSuggestions: z.array(z.string()).default([]),
  archetype: SceneArchetypeSchema.default('KINETIC_TITLE'),
  metrics: z.array(MetricItemSchema).optional().default([]),
  features: z.array(FeatureItemSchema).optional().default([]),
  layout: z.enum(['center', 'split-left', 'split-right', 'minimal', 'hud-frame']).default('center'),
  motionPreset: z.enum(['energetic', 'smooth', 'cyber', 'minimal', 'dramatic']).default('energetic'),
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

export const ServerStoryboardSchema = z.object({
  topic: z.string().default(''),
  language: z.enum(['en', 'bn']).default('en'),
  totalDurationInSeconds: z.number().min(1).default(30),
  sceneCount: z.number().int().min(1).default(5),
  scenes: z.array(ServerSceneSchema)
});

export function validateStoryboardData(data) {
  return ServerStoryboardSchema.parse(data);
}

export function validateSceneData(data) {
  return ServerSceneSchema.parse(data);
}

