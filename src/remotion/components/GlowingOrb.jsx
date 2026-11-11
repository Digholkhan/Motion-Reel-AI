import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const GlowingOrb = ({
  color1 = '#3B82F6',
  color2 = '#8B5CF6',
  size = 500,
  x = '50%',
  y = '50%',
  pulseSpeed = 0.04
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(Math.sin(frame * pulseSpeed), [-1, 1], [0.92, 1.15]);
  const rot = (frame * 0.5) % 360;
  const opacity = interpolate(Math.cos(frame * pulseSpeed * 0.7), [-1, 1], [0.35, 0.65]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 45%, transparent 70%)`,
        filter: 'blur(70px)',
        opacity,
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

