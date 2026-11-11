import React from 'react';
import { AbsoluteFill, Series, Audio, useVideoConfig } from 'remotion';
import { SceneTransition } from './transitions/SceneTransition';
import { KineticTitleScene } from './scenes/KineticTitleScene';
import { TechHudScene } from './scenes/TechHudScene';
import { MetricCounterScene } from './scenes/MetricCounterScene';
import { FeatureCardsScene } from './scenes/FeatureCardsScene';
import { IsometricBadgeScene } from './scenes/IsometricBadgeScene';
import { CallToActionScene } from './scenes/CallToActionScene';

const renderSceneByArchetype = (scene, project, isVertical) => {
  switch (scene.archetype) {
    case 'TECH_HUD':
      return <TechHudScene scene={scene} project={project} isVertical={isVertical} />;
    case 'METRIC_COUNTER':
      return <MetricCounterScene scene={scene} project={project} isVertical={isVertical} />;
    case 'FEATURE_CARDS':
      return <FeatureCardsScene scene={scene} project={project} isVertical={isVertical} />;
    case 'ISOMETRIC_BADGE':
      return <IsometricBadgeScene scene={scene} project={project} isVertical={isVertical} />;
    case 'CALL_TO_ACTION':
      return <CallToActionScene scene={scene} project={project} isVertical={isVertical} />;
    case 'KINETIC_TITLE':
    default:
      return <KineticTitleScene scene={scene} project={project} isVertical={isVertical} />;
  }
};

export const MotionReel = ({ project }) => {
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const scenes = project?.scenes && project.scenes.length > 0 ? project.scenes : [
    {
      id: 'default-1',
      order: 0,
      durationInSeconds: 5,
      archetype: 'KINETIC_TITLE',
      heading: 'MOTIONFORGE AI',
      subheading: 'NEXT-GENERATION DYNAMIC MOTION REELS',
      badge: '⚡ AUTONOMOUS TIMELINE ENGINE',
      colorPalette: { bg: '#070B14', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#94A3B8' },
      transition: { type: 'zoom', durationInFrames: 15 },
      visualElements: { showGrid: true, showParticles: true, showOrb: true }
    }
  ];

  const musicUrl = project?.music?.enabled ? (project.music.audioUrl || '/api/voice/audio/cyber-pulse.wav') : null;
  const musicVolume = project?.music?.volume ?? 0.25;

  return (
    <AbsoluteFill style={{ backgroundColor: project?.theme?.bgColor || '#060911' }}>
      {musicUrl && (
        <Audio
          src={musicUrl}
          volume={musicVolume}
        />
      )}

      <Series>
        {scenes.map((scene, idx) => {
          const durationInFrames = Math.max(30, Math.round((scene.durationInSeconds || 5) * fps));
          const transitionType = scene.transition?.type || 'zoom';
          const transitionFrames = scene.transition?.durationInFrames || 15;

          return (
            <Series.Sequence key={scene.id || idx} durationInFrames={durationInFrames}>
              <SceneTransition
                type={transitionType}
                durationInFrames={transitionFrames}
                sceneDurationInFrames={durationInFrames}
              >
                {renderSceneByArchetype(scene, project, isVertical)}
              </SceneTransition>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};

