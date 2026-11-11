import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SceneTransition = ({
  children,
  type = 'zoom',
  durationInFrames = 15,
  sceneDurationInFrames = 150
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro transition
  const introSpr = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 100 }
  });

  // Outro transition (last `durationInFrames` frames of scene)
  const outroStart = Math.max(0, sceneDurationInFrames - durationInFrames);
  const outroFrame = Math.max(0, frame - outroStart);
  const outroProgress = outroFrame / durationInFrames;

  let transform = 'none';
  let opacity = 1;
  let filter = 'none';

  if (type === 'zoom') {
    const introScale = interpolate(introSpr, [0, 1], [0.85, 1]);
    const outroScale = interpolate(outroProgress, [0, 1], [1, 1.15]);
    const currentScale = frame < outroStart ? introScale : outroScale;
    transform = `scale(${currentScale})`;
    opacity = frame < outroStart
      ? interpolate(introSpr, [0, 1], [0, 1])
      : interpolate(outroProgress, [0, 1], [1, 0]);
  } else if (type === 'slide') {
    const introX = interpolate(introSpr, [0, 1], [100, 0]);
    const outroX = interpolate(outroProgress, [0, 1], [0, -100]);
    const currentX = frame < outroStart ? introX : outroX;
    transform = `translateX(${currentX}px)`;
    opacity = frame < outroStart
      ? interpolate(introSpr, [0, 1], [0, 1])
      : interpolate(outroProgress, [0, 1], [1, 0]);
  } else if (type === 'wipe') {
    opacity = frame < outroStart
      ? interpolate(introSpr, [0, 1], [0, 1])
      : interpolate(outroProgress, [0, 1], [1, 0]);
    const introY = interpolate(introSpr, [0, 1], [40, 0]);
    transform = `translateY(${introY}px)`;
  } else if (type === 'glitch') {
    const isGlitching = (frame < 8) || (frame > outroStart + 5);
    opacity = frame < outroStart
      ? interpolate(introSpr, [0, 1], [0, 1])
      : interpolate(outroProgress, [0, 1], [1, 0]);
    transform = isGlitching ? `scale(1.02) skewX(${Math.sin(frame) * 2}deg)` : 'none';
  } else {
    // Fade default
    opacity = frame < outroStart
      ? interpolate(introSpr, [0, 1], [0, 1])
      : interpolate(outroProgress, [0, 1], [1, 0]);
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform,
        opacity,
        filter,
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

