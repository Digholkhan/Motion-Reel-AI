import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const ShapeMorph = ({
  shape = 'hexagon', // 'circle' | 'squircle' | 'hexagon' | 'diamond' | 'shield'
  size = 220,
  color = '#3B82F6',
  secondaryColor = '#8B5CF6',
  morphSpeed = 0.04,
  rotSpeed = 0.5,
  glowIntensity = 0.4,
  style = {}
}) => {
  const frame = useCurrentFrame();

  const rot = (frame * rotSpeed) % 360;
  const pulse = interpolate(Math.sin(frame * morphSpeed), [-1, 1], [0.92, 1.08]);
  const morphT = interpolate(Math.sin(frame * morphSpeed * 0.7), [-1, 1], [0, 1]);

  // Interpolated corner curves for dynamic polygon
  const renderShapePath = () => {
    switch (shape) {
      case 'hexagon': {
        const r = 90 * pulse;
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60) * (Math.PI / 180);
          pts.push(`${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`);
        }
        return <polygon points={pts.join(' ')} fill="url(#morphGrad)" stroke={color} strokeWidth="2.5" />;
      }
      case 'diamond': {
        const p1 = 100 - 80 * pulse;
        const p2 = 100 + 80 * pulse;
        return <polygon points={`100,${p1} ${p2},100 100,${p2} ${p1},100`} fill="url(#morphGrad)" stroke={color} strokeWidth="2.5" />;
      }
      case 'shield': {
        return (
          <path
            d={`M 100 25 L 175 55 C 175 125, 135 165, 100 185 C 65 165, 25 125, 25 55 Z`}
            fill="url(#morphGrad)"
            stroke={color}
            strokeWidth="2.5"
            transform={`scale(${pulse})`}
            transformOrigin="100 100"
          />
        );
      }
      case 'squircle': {
        const radius = interpolate(morphT, [0, 1], [25, 45]);
        return (
          <rect
            x="25"
            y="25"
            width="150"
            height="150"
            rx={radius}
            fill="url(#morphGrad)"
            stroke={color}
            strokeWidth="2.5"
            transform={`scale(${pulse})`}
            transformOrigin="100 100"
          />
        );
      }
      case 'circle':
      default: {
        const r = 75 * pulse;
        return <circle cx="100" cy="100" r={r} fill="url(#morphGrad)" stroke={color} strokeWidth="2.5" />;
      }
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: `drop-shadow(0 0 ${20 * glowIntensity}px ${color})`,
        ...style
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="morphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Outer orbital dash ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1.5"
          strokeDasharray="18 12 4 12"
          transform={`rotate(${rot} 100 100)`}
          opacity="0.6"
        />

        {/* Morphing Shape Core */}
        {renderShapePath()}

        {/* Inner Crosshair Accents */}
        <line x1="100" y1="40" x2="100" y2="55" stroke={color} strokeWidth="2" opacity="0.8" />
        <line x1="100" y1="145" x2="100" y2="160" stroke={color} strokeWidth="2" opacity="0.8" />
        <line x1="40" y1="100" x2="55" y2="100" stroke={color} strokeWidth="2" opacity="0.8" />
        <line x1="145" y1="100" x2="160" y2="100" stroke={color} strokeWidth="2" opacity="0.8" />
      </svg>
    </div>
  );
};

