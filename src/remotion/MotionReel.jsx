import React from 'react';
import { AbsoluteFill, Series, Audio, useVideoConfig } from 'remotion';
import { DynamicSceneRenderer } from './sceneRenderer/DynamicSceneRenderer';

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

          return (
            <Series.Sequence key={scene.id || idx} durationInFrames={durationInFrames}>
              <DynamicSceneRenderer
                scene={scene}
                project={project}
                index={idx}
                totalScenes={scenes.length}
                isVertical={isVertical}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
