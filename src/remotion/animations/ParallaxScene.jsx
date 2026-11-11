import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const ParallaxScene = ({
  backgroundLayer = null,
  midgroundLayer = null,
  foregroundLayer = null,
  accentLayer = null,
  intensity = 1.0,
  direction = 'orbit', // 'orbit' | 'horizontal' | 'vertical'
  style = {}
}) => {
  const frame = useCurrentFrame();

  // Multi-tier parallax movement offsets
  let bgX = 0, bgY = 0;
  let midX = 0, midY = 0;
  let fgX = 0, fgY = 0;
  let accX = 0, accY = 0;

  if (direction === 'orbit') {
    const angle = frame * 0.04;
    // Layer 1: Background (slowest, depth = 0.2)
    bgX = Math.cos(angle) * 4 * intensity;
    bgY = Math.sin(angle) * 3 * intensity;

    // Layer 2: Midground (medium, depth = 0.6)
    midX = Math.cos(angle) * 12 * intensity;
    midY = Math.sin(angle) * 9 * intensity;

    // Layer 3: Foreground (fast, depth = 1.0)
    fgX = Math.cos(angle) * 20 * intensity;
    fgY = Math.sin(angle) * 15 * intensity;

    // Layer 4: Floating accents (counter-orbit, depth = 1.4)
    accX = -Math.cos(angle * 1.3) * 28 * intensity;
    accY = -Math.sin(angle * 1.3) * 22 * intensity;
  } else if (direction === 'horizontal') {
    const shift = Math.sin(frame * 0.05);
    bgX = shift * 6 * intensity;
    midX = shift * 16 * intensity;
    fgX = shift * 28 * intensity;
    accX = -shift * 36 * intensity;
  } else {
    // vertical
    const shift = Math.sin(frame * 0.05);
    bgY = shift * 5 * intensity;
    midY = shift * 14 * intensity;
    fgY = shift * 24 * intensity;
    accY = -shift * 32 * intensity;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        ...style
      }}
    >
      {/* 1. Background Layer */}
      {backgroundLayer && (
        <div
          style={{
            position: 'absolute',
            inset: '-5%',
            transform: `translate3d(${bgX}px, ${bgY}px, 0)`,
            zIndex: 0,
            willChange: 'transform'
          }}
        >
          {backgroundLayer}
        </div>
      )}

      {/* 2. Midground Layer */}
      {midgroundLayer && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate3d(${midX}px, ${midY}px, 0)`,
            zIndex: 1,
            pointerEvents: 'none',
            willChange: 'transform'
          }}
        >
          {midgroundLayer}
        </div>
      )}

      {/* 3. Foreground Layer (Core content / typography) */}
      {foregroundLayer && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate3d(${fgX}px, ${fgY}px, 0)`,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform'
          }}
        >
          {foregroundLayer}
        </div>
      )}

      {/* 4. Floating Accent Layer */}
      {accentLayer && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate3d(${accX}px, ${accY}px, 0)`,
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform'
          }}
        >
          {accentLayer}
        </div>
      )}
    </div>
  );
};

