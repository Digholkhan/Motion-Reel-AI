import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const GlitchTransition = ({
  children,
  durationInFrames = 15,
  sceneDurationInFrames = 150
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outroStart = Math.max(0, sceneDurationInFrames - durationInFrames);
  const isGlitching = (frame < 10) || (frame > outroStart + 4);

  // Intro spring
  const introSpr = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 160 }
  });

  const outroProgress = Math.max(0, Math.min(1, (frame - outroStart) / durationInFrames));
  const opacity = frame < outroStart
    ? interpolate(introSpr, [0, 1], [0, 1])
    : interpolate(outroProgress, [0, 1], [1, 0]);

  // Pseudo-random chromatic RGB offset
  const shift = isGlitching ? Math.sin(frame * 3.7) * 8 : 0;
  const skew = isGlitching ? Math.cos(frame * 2.1) * 3 : 0;
  const sliceY = isGlitching ? Math.sin(frame * 4.3) * 4 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: isGlitching ? `translate(${shift}px, ${sliceY}px) skewX(${skew}deg)` : 'none',
        filter: isGlitching
          ? `drop-shadow(${shift * 1.5}px 0 0 rgba(239, 68, 68, 0.75)) drop-shadow(${-shift * 1.5}px 0 0 rgba(6, 182, 212, 0.75))`
          : 'none',
        overflow: 'hidden',
        willChange: 'transform, filter, opacity'
      }}
    >
      {children}
    </div>
  );
};

