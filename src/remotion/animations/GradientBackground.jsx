import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const GradientBackground = ({
  color1 = '#070B14',
  color2 = '#0F172A',
  accentColor = '#3B82F6',
  secondaryColor = '#8B5CF6',
  type = 'mesh', // 'mesh' | 'radial' | 'linear'
  driftSpeed = 0.03,
  glowOpacity = 0.35,
  showVignette = true,
  style = {}
}) => {
  const frame = useCurrentFrame();

  const rot = (frame * 0.4) % 360;
  const pulseScale = interpolate(Math.sin(frame * driftSpeed), [-1, 1], [0.9, 1.15]);
  const posX = interpolate(Math.sin(frame * driftSpeed * 0.8), [-1, 1], [40, 60]);
  const posY = interpolate(Math.cos(frame * driftSpeed * 0.6), [-1, 1], [35, 65]);

  if (type === 'radial') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color1,
          overflow: 'hidden',
          zIndex: 0,
          ...style
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${posX}%`,
            top: `${posY}%`,
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 65%)`,
            filter: 'blur(90px)',
            opacity: glowOpacity
          }}
        />
        {showVignette && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 40%, rgba(6, 9, 17, 0.9) 95%)'
            }}
          />
        )}
      </div>
    );
  }

  // Mesh gradient with dual floating orbs
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: color1,
        overflow: 'hidden',
        zIndex: 0,
        ...style
      }}
    >
      {/* Primary Glowing Gradient Orb */}
      <div
        style={{
          position: 'absolute',
          left: `${posX}%`,
          top: `${posY}%`,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${pulseScale})`,
          width: '750px',
          height: '550px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${accentColor} 0%, ${secondaryColor} 45%, transparent 70%)`,
          filter: 'blur(95px)',
          opacity: glowOpacity,
          willChange: 'transform'
        }}
      />

      {/* Secondary Counter-Rotating Accent Orb */}
      <div
        style={{
          position: 'absolute',
          left: `${100 - posX}%`,
          top: `${100 - posY}%`,
          transform: `translate(-50%, -50%) rotate(${-rot * 0.7}deg) scale(${pulseScale * 0.85})`,
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 65%)`,
          filter: 'blur(80px)',
          opacity: glowOpacity * 0.75,
          willChange: 'transform'
        }}
      />

      {/* Dark Vignette Overlay */}
      {showVignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 35%, rgba(6, 9, 17, 0.88) 95%)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

