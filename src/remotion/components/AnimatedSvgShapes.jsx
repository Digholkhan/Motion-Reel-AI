import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const CyberRing = ({ size = 260, color = '#3B82F6', secondaryColor = '#8B5CF6' }) => {
  const frame = useCurrentFrame();
  const rot1 = (frame * 0.8) % 360;
  const rot2 = (-frame * 1.2) % 360;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
      {/* Outer segmented ring */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="25 15 5 15"
        transform={`rotate(${rot1} 100 100)`}
        style={{ opacity: 0.7 }}
      />
      {/* Inner dotted ring */}
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeDasharray="4 8"
        transform={`rotate(${rot2} 100 100)`}
        style={{ opacity: 0.8 }}
      />
      {/* Glowing center accents */}
      <circle cx="100" cy="100" r="50" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="100" y1="20" x2="100" y2="40" stroke={color} strokeWidth="2" />
      <line x1="100" y1="160" x2="100" y2="180" stroke={color} strokeWidth="2" />
      <line x1="20" y1="100" x2="40" y2="100" stroke={color} strokeWidth="2" />
      <line x1="160" y1="100" x2="180" y2="100" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export const HudBrackets = ({ width = '100%', height = '100%', color = '#3B82F6', length = 40, stroke = 2 }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Top Left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${length}px`,
          height: `${length}px`,
          borderTop: `${stroke}px solid ${color}`,
          borderLeft: `${stroke}px solid ${color}`
        }}
      />
      {/* Top Right */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: `${length}px`,
          height: `${length}px`,
          borderTop: `${stroke}px solid ${color}`,
          borderRight: `${stroke}px solid ${color}`
        }}
      />
      {/* Bottom Left */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${length}px`,
          height: `${length}px`,
          borderBottom: `${stroke}px solid ${color}`,
          borderLeft: `${stroke}px solid ${color}`
        }}
      />
      {/* Bottom Right */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: `${length}px`,
          height: `${length}px`,
          borderBottom: `${stroke}px solid ${color}`,
          borderRight: `${stroke}px solid ${color}`
        }}
      />
    </div>
  );
};

export const EqualizerBars = ({ count = 8, color = '#3B82F6', height = 30 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: `${height}px` }}>
      {Array.from({ length: count }).map((_, i) => {
        const barHeight = interpolate(
          Math.sin(frame * 0.2 + i * 0.8) + Math.cos(frame * 0.15 + i * 1.2),
          [-2, 2],
          [4, height]
        );
        return (
          <div
            key={i}
            style={{
              width: '4px',
              height: `${barHeight}px`,
              backgroundColor: color,
              borderRadius: '2px',
              opacity: 0.85
            }}
          />
        );
      })}
    </div>
  );
};

export const ScannerLine = ({ color = '#06B6D4' }) => {
  const frame = useCurrentFrame();
  const pos = (frame * 2.5) % 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${pos}%`,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 10px ${color}`,
        pointerEvents: 'none',
        opacity: 0.7
      }}
    />
  );
};

