/**
 * AnimationRegistry.js
 * 10+ Visually Distinct Animation Combinations for Remotion Scenes
 */

export const ANIMATION_RECIPES = {
  // 1. Cybernetic Tech HUD
  CYBER_PUNCH: {
    id: 'CYBER_PUNCH',
    name: 'Cybernetic Reticle & Tech HUD',
    typography: 'character', // CharacterReveal
    visuals: ['svg-reticle', 'scanner-line', 'equalizer'],
    background: 'hud-grid',
    transition: 'glitch',
    parallax: 'horizontal',
    preset: 'cyber'
  },

  // 2. High-Energy Kinetic Cascade
  KINETIC_CASCADE: {
    id: 'KINETIC_CASCADE',
    name: 'Staggered Kinetic Word Cascade',
    typography: 'word-reveal', // WordReveal
    visuals: ['particles', 'mesh-gradient', 'orbit-ring'],
    background: 'gradient-drift',
    transition: 'zoom',
    parallax: 'orbit',
    preset: 'energetic'
  },

  // 3. Metric Gauge Accelerator
  METRIC_ACCELERATOR: {
    id: 'METRIC_ACCELERATOR',
    name: 'Animated Radial Metric Accelerator',
    typography: 'counter', // AnimatedCounter + radial gauge
    visuals: ['radial-gauge', 'particles'],
    background: 'particle-field',
    transition: 'blur',
    parallax: 'vertical',
    preset: 'dramatic'
  },

  // 4. 3D Isometric Floating Shield
  ISOMETRIC_SHIELD: {
    id: 'ISOMETRIC_SHIELD',
    name: '3D Floating Isometric Shield',
    typography: 'text-mask', // TextMaskReveal
    visuals: ['shape-morph-shield', 'orbital-dash'],
    background: 'deep-navy',
    transition: 'slide',
    parallax: 'orbit',
    preset: 'energetic'
  },

  // 5. Multi-Icon Feature Trio
  FEATURE_TRIO: {
    id: 'FEATURE_TRIO',
    name: 'Staggered Vector Feature Trio',
    typography: 'word-reveal',
    visuals: ['icon-trio', 'glass-cards'],
    background: 'gradient-drift',
    transition: 'zoom',
    parallax: 'horizontal',
    preset: 'smooth'
  },

  // 6. Minimal Luxury Editorial
  MINIMAL_EDITORIAL: {
    id: 'MINIMAL_EDITORIAL',
    name: 'Minimal Bounding Mask Editorial',
    typography: 'text-mask', // TextMaskReveal bottom-to-top
    visuals: ['minimal-ring'],
    background: 'dark-minimal',
    transition: 'blur',
    parallax: 'vertical',
    preset: 'minimal'
  },

  // 7. Electronic Circuit Telemetry
  DATA_TELEMETRY: {
    id: 'DATA_TELEMETRY',
    name: 'Electronic Circuit & Vector Draw',
    typography: 'character', // CharacterReveal typewriter
    visuals: ['svg-circuit', 'telemetry-readout'],
    background: 'matrix-grid',
    transition: 'glitch',
    parallax: 'horizontal',
    preset: 'cyber'
  },

  // 8. Neural Particle Explosion
  NEURAL_EXPLOSION: {
    id: 'NEURAL_EXPLOSION',
    name: 'Neural Particle & Kinetic Typography',
    typography: 'kinetic-full', // KineticTypography
    visuals: ['dense-particles', 'radial-orb'],
    background: 'particle-field',
    transition: 'zoom',
    parallax: 'orbit',
    preset: 'energetic'
  },

  // 9. Split Velocity Metric & Headline
  SPLIT_VELOCITY: {
    id: 'SPLIT_VELOCITY',
    name: 'Split Velocity Counter & Word Reveal',
    typography: 'split-counter-words',
    visuals: ['counter-mini', 'scanner-line'],
    background: 'cyber-haze',
    transition: 'slide',
    parallax: 'horizontal',
    preset: 'dramatic'
  },

  // 10. High-Converting Climax CTA
  CLIMACTIC_CTA: {
    id: 'CLIMACTIC_CTA',
    name: 'High-Converting Pulsing Action CTA',
    typography: 'kinetic-full',
    visuals: ['pulsing-rocket', 'glowing-button', 'particle-burst'],
    background: 'gradient-drift',
    transition: 'blur',
    parallax: 'orbit',
    preset: 'energetic'
  }
};

/**
 * Resolves the optimal animation recipe based on a scene's data
 */
export function resolveAnimationRecipe(scene, index, totalScenes) {
  const archetype = scene.archetype;
  const isFirst = index === 0;
  const isLast = index === totalScenes - 1;

  if (isLast) return ANIMATION_RECIPES.CLIMACTIC_CTA;

  switch (archetype) {
    case 'TECH_HUD':
      return index % 2 === 0 ? ANIMATION_RECIPES.CYBER_PUNCH : ANIMATION_RECIPES.DATA_TELEMETRY;
    case 'METRIC_COUNTER':
      return index % 2 === 0 ? ANIMATION_RECIPES.METRIC_ACCELERATOR : ANIMATION_RECIPES.SPLIT_VELOCITY;
    case 'FEATURE_CARDS':
      return ANIMATION_RECIPES.FEATURE_TRIO;
    case 'ISOMETRIC_BADGE':
      return ANIMATION_RECIPES.ISOMETRIC_SHIELD;
    case 'CALL_TO_ACTION':
      return ANIMATION_RECIPES.CLIMACTIC_CTA;
    case 'KINETIC_TITLE':
    default:
      if (scene.motionPreset === 'minimal') return ANIMATION_RECIPES.MINIMAL_EDITORIAL;
      if (scene.motionPreset === 'cyber') return ANIMATION_RECIPES.DATA_TELEMETRY;
      return isFirst ? ANIMATION_RECIPES.KINETIC_CASCADE : ANIMATION_RECIPES.NEURAL_EXPLOSION;
  }
}

