import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const GridBackground = ({ color = '#3B82F6', opacity = 0.15, isVertical = false }) => {
  const frame = useCurrentFrame();
  const offsetY = (frame * 0.8) % 60;
  const pulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1.2]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage: `
            linear-gradient(to right, ${color} 1px, transparent 1px),
            linear-gradient(to bottom, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: `0px ${offsetY}px`,
          opacity: opacity * pulse,
          transform: isVertical ? 'perspective(800px) rotateX(15deg)' : 'perspective(1000px) rotateX(25deg)',
          transformOrigin: 'center 40%'
        }}
      />
      {/* Radial vignette mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, #060911 85%)'
        }}
      />
    </div>
  );
};

