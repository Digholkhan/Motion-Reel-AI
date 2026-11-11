import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const IconAnimation = ({
  icon = 'zap', // 'zap' | 'shield' | 'cpu' | 'rocket' | 'chart' | 'lock' | 'globe' | 'check' | 'sparkles' | 'layers'
  animationType = 'float', // 'float' | 'pulse' | 'elastic-drop' | 'spin'
  color = '#3B82F6',
  size = 56,
  badgeBackground = true,
  delay = 0,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 }
  });

  const entryScale = interpolate(spr, [0, 1], [0.2, 1]);
  const entryOpacity = interpolate(spr, [0, 1], [0, 1]);

  // Continuous animation modes
  let continuousTransform = '';
  if (animationType === 'float') {
    const floatY = Math.sin(frame * 0.08) * 8;
    continuousTransform = `translateY(${floatY}px)`;
  } else if (animationType === 'pulse') {
    const pulseScale = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.94, 1.08]);
    continuousTransform = `scale(${pulseScale})`;
  } else if (animationType === 'spin') {
    const rot = (frame * 1.5) % 360;
    continuousTransform = `rotate(${rot}deg)`;
  }

  const renderIconSvg = () => {
    const iconSize = Math.round(size * 0.55);
    switch (icon) {
      case 'shield':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'cpu':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2 M9 2v2 M15 20v2 M9 20v2 M2 15h2 M2 9h2 M20 15h2 M20 9h2" />
          </svg>
        );
      case 'rocket':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          </svg>
        );
      case 'chart':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        );
      case 'globe':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case 'layers':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      case 'check':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'zap':
      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: Math.round(size * 0.28) + 'px',
        backgroundColor: badgeBackground ? `${color}18` : 'transparent',
        border: badgeBackground ? `1px solid ${color}55` : 'none',
        boxShadow: badgeBackground ? `0 0 25px ${color}33` : 'none',
        transform: `scale(${entryScale}) ${continuousTransform}`,
        opacity: entryOpacity,
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {renderIconSvg()}
    </div>
  );
};

