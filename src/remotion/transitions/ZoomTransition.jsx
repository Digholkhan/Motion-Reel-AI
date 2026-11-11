import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ZoomTransition = ({
  children,
  durationInFrames = 15,
  sceneDurationInFrames = 150,
  zoomMode = 'punch' // 'punch' (zoom in -> warp out) | 'retract' (scale down -> drop)
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro spring zoom
  const introSpr = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 120 }
  });
  const introScale = interpolate(introSpr, [0, 1], [0.75, 1]);
  const introOpacity = interpolate(introSpr, [0, 1], [0, 1]);

  // Outro transition
  const outroStart = Math.max(0, sceneDurationInFrames - durationInFrames);
  const outroProgress = Math.max(0, Math.min(1, (frame - outroStart) / durationInFrames));
  const outroScale = interpolate(outroProgress, [0, 1], [1, 1.25]);
  const outroOpacity = interpolate(outroProgress, [0, 1], [1, 0]);

  const isIntro = frame < outroStart;
  const currentScale = isIntro ? introScale : outroScale;
  const currentOpacity = isIntro ? introOpacity : outroOpacity;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${currentScale})`,
        opacity: currentOpacity,
        overflow: 'hidden',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

