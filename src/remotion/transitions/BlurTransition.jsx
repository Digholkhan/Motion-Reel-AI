import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const BlurTransition = ({
  children,
  durationInFrames = 15,
  sceneDurationInFrames = 150,
  maxBlur = 20
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro transition
  const introSpr = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 100 }
  });
  const introBlur = interpolate(introSpr, [0, 1], [maxBlur, 0]);
  const introScale = interpolate(introSpr, [0, 1], [1.12, 1]);
  const introOpacity = interpolate(introSpr, [0, 1], [0, 1]);

  // Outro transition
  const outroStart = Math.max(0, sceneDurationInFrames - durationInFrames);
  const outroProgress = Math.max(0, Math.min(1, (frame - outroStart) / durationInFrames));
  const outroBlur = interpolate(outroProgress, [0, 1], [0, maxBlur]);
  const outroScale = interpolate(outroProgress, [0, 1], [1, 0.92]);
  const outroOpacity = interpolate(outroProgress, [0, 1], [1, 0]);

  const isIntro = frame < outroStart;
  const currentBlur = isIntro ? introBlur : outroBlur;
  const currentScale = isIntro ? introScale : outroScale;
  const currentOpacity = isIntro ? introOpacity : outroOpacity;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        filter: currentBlur > 0.5 ? `blur(${currentBlur.toFixed(1)}px)` : 'none',
        transform: `scale(${currentScale})`,
        opacity: currentOpacity,
        overflow: 'hidden',
        willChange: 'filter, transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

