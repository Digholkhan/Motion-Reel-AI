import React from 'react';
import { Composition } from 'remotion';
import { MotionReel } from './MotionReel';

/**
 * Sample scene factories for isolated recipe testing.
 * Each returns a minimal project with one scene to verify
 * that the DynamicSceneRenderer activates the intended recipe.
 */
const makeProject = (id, scenes, extra = {}) => ({
  id,
  title: id,
  theme: {
    bgColor: '#070B14',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter'
  },
  fps: 30,
  aspectRatio: '16:9',
  music: { enabled: false },
  scenes,
  ...extra
});

const RECIPE_DEMOS = {
  CyberPunch: makeProject('demo-cyber-punch', [{
    id: 'r1', order: 0, durationInSeconds: 5, archetype: 'TECH_HUD',
    heading: 'SYSTEM PROTOCOL ACTIVE', subheading: 'Neural network initialized — scanning vectors',
    badge: '⚡ RETICLE HUD', emphasizedKeywords: ['Neural', 'Protocol'],
    colorPalette: { bg: '#070B14', accent: '#3B82F6' },
    transition: { type: 'glitch', durationInFrames: 15 }
  }]),

  KineticCascade: makeProject('demo-kinetic-cascade', [{
    id: 'r2', order: 0, durationInSeconds: 5, archetype: 'KINETIC_TITLE',
    heading: 'KINETIC MOTION ENGINE', subheading: 'Staggered spring-physics word cascade',
    badge: '✦ ENERGETIC PRESET', emphasizedKeywords: ['KINETIC', 'ENGINE'],
    colorPalette: { bg: '#070B14', accent: '#8B5CF6' },
    transition: { type: 'zoom', durationInFrames: 15 }
  }]),

  MetricAccelerator: makeProject('demo-metric-accelerator', [{
    id: 'r3', order: 0, durationInSeconds: 5, archetype: 'METRIC_COUNTER',
    heading: 'PERFORMANCE METRICS', badge: '📊 BENCHMARKS',
    emphasizedKeywords: ['PERFORMANCE'],
    metrics: [
      { label: 'UPTIME', targetNumber: 99, suffix: '%' },
      { label: 'SPEED', targetNumber: 120, suffix: 'ms' }
    ],
    colorPalette: { bg: '#070B14', accent: '#10B981' },
    transition: { type: 'blur', durationInFrames: 15 }
  }]),

  IsometricShield: makeProject('demo-isometric-shield', [{
    id: 'r4', order: 0, durationInSeconds: 5, archetype: 'ISOMETRIC_BADGE',
    heading: 'ENTERPRISE-GRADE SECURITY', subheading: 'Zero-trust architecture with AES-256 encryption',
    emphasizedKeywords: ['Security', 'Enterprise'],
    colorPalette: { bg: '#060B18', accent: '#6366F1' },
    transition: { type: 'slide', durationInFrames: 15 }
  }]),

  FeatureTrio: makeProject('demo-feature-trio', [{
    id: 'r5', order: 0, durationInSeconds: 5, archetype: 'FEATURE_CARDS',
    heading: 'MODULAR CAPABILITIES',
    emphasizedKeywords: ['Modular'],
    features: [
      { title: 'Smart Automation', description: 'Autonomous pipeline orchestration', icon: 'zap' },
      { title: 'Real-time Preview', description: 'Frame-accurate Remotion playback', icon: 'monitor' },
      { title: 'Cloud Export', description: 'H.264 MP4 rendering at scale', icon: 'cloud' }
    ],
    colorPalette: { bg: '#070B14', accent: '#3B82F6' },
    transition: { type: 'zoom', durationInFrames: 15 }
  }]),

  MinimalEditorial: makeProject('demo-minimal-editorial', [{
    id: 'r6', order: 0, durationInSeconds: 5, archetype: 'KINETIC_TITLE',
    motionPreset: 'minimal',
    heading: 'EDITORIAL PRECISION', subheading: 'Clean typography with mask reveal animations',
    emphasizedKeywords: ['EDITORIAL'],
    colorPalette: { bg: '#070B14', accent: '#94A3B8' },
    transition: { type: 'blur', durationInFrames: 15 }
  }]),

  DataTelemetry: makeProject('demo-data-telemetry', [{
    id: 'r7', order: 1, durationInSeconds: 5, archetype: 'TECH_HUD',
    heading: 'TELEMETRY READOUT', subheading: 'Circuit vector trace — typewriter decode',
    badge: '◈ CIRCUIT HUD', emphasizedKeywords: ['Telemetry'],
    colorPalette: { bg: '#070B14', accent: '#22D3EE' },
    transition: { type: 'glitch', durationInFrames: 15 }
  }]),

  NeuralExplosion: makeProject('demo-neural-explosion', [{
    id: 'r8', order: 1, durationInSeconds: 5, archetype: 'KINETIC_TITLE',
    heading: 'NEURAL SYNTHESIS ENGINE', subheading: 'Dense particle field with kinetic typography',
    badge: '⚡ PARTICLE BURST', emphasizedKeywords: ['Neural', 'Synthesis'],
    colorPalette: { bg: '#070B14', accent: '#A855F7' },
    transition: { type: 'zoom', durationInFrames: 15 }
  }]),

  SplitVelocity: makeProject('demo-split-velocity', [{
    id: 'r9', order: 1, durationInSeconds: 5, archetype: 'METRIC_COUNTER',
    heading: 'VELOCITY MULTIPLIER', subheading: 'Split-layout counter with word reveal',
    emphasizedKeywords: ['VELOCITY'],
    metrics: [{ label: 'SPEED BOOST', targetNumber: 10, suffix: 'x' }],
    colorPalette: { bg: '#070B14', accent: '#F59E0B' },
    transition: { type: 'slide', durationInFrames: 15 }
  }]),

  ClimacticCTA: makeProject('demo-climactic-cta', [{
    id: 'r10', order: 0, durationInSeconds: 5, archetype: 'CALL_TO_ACTION',
    heading: 'BUILD YOUR REEL NOW', subheading: 'Transform ideas into cinematic motion reels',
    emphasizedKeywords: ['BUILD', 'REEL'],
    colorPalette: { bg: '#070B14', accent: '#3B82F6' },
    transition: { type: 'blur', durationInFrames: 15 }
  }])
};

export const RemotionRoot = () => {
  return (
    <>
      {/* Primary Composition — used by renderService and VideoPreviewStudio */}
      <Composition
        id="MotionReel"
        component={MotionReel}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          project: null
        }}
      />

      {/* Vertical aspect ratio composition */}
      <Composition
        id="MotionReel-Vertical"
        component={MotionReel}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          project: null
        }}
      />

      {/* Square aspect ratio composition */}
      <Composition
        id="MotionReel-Square"
        component={MotionReel}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          project: null
        }}
      />

      {/* Individual Recipe Test Compositions */}
      {Object.entries(RECIPE_DEMOS).map(([name, project]) => (
        <Composition
          key={name}
          id={`Recipe-${name}`}
          component={MotionReel}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            project
          }}
        />
      ))}
    </>
  );
};
