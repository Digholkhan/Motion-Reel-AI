import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SlideTransition = ({
  children,
  durationInFrames = 15,
  sceneDurationInFrames = 150,
  direction = 'left' // 'left' | 'right' | 'up' | 'down'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro spring
  const introSpr = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 110 }
  });

  // Outro transition
  const outroStart = Math.max(0, sceneDurationInFrames - durationInFrames);
  const outroProgress = Math.max(0, Math.min(1, (frame - outroStart) / durationInFrames));

  const isIntro = frame < outroStart;

  let transform = '';
  if (direction === 'left') {
    const x = isIntro ? interpolate(introSpr, [0, 1], [100, 0]) : interpolate(outroProgress, [0, 1], [0, -100]);
    const skew = isIntro ? interpolate(introSpr, [0, 1], [-4, 0]) : interpolate(outroProgress, [0, 1], [0, 4]);
    transform = `translateX(${x}%) skewX(${skew}deg)`;
  } else if (direction === 'right') {
    const x = isIntro ? interpolate(introSpr, [0, 1], [-100, 0]) : interpolate(outroProgress, [0, 1], [0, 100]);
    const skew = isIntro ? interpolate(introSpr, [0, 1], [4, 0]) : interpolate(outroProgress, [0, 1], [0, -4]);
    transform = `translateX(${x}%) skewX(${skew}deg)`;
  } else if (direction === 'up') {
    const y = isIntro ? interpolate(introSpr, [0, 1], [100, 0]) : interpolate(outroProgress, [0, 1], [0, -100]);
    transform = `translateY(${y}%)`;
  } else {
    // down
    const y = isIntro ? interpolate(introSpr, [0, 1], [-100, 0]) : interpolate(outroProgress, [0, 1], [0, 100]);
    transform = `translateY(${y}%)`;
  }

  const opacity = isIntro
    ? interpolate(introSpr, [0, 1], [0, 1])
    : interpolate(outroProgress, [0, 1], [1, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform,
        opacity,
        overflow: 'hidden',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

