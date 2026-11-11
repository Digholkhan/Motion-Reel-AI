import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const SVGDraw = ({
  pathType = 'reticle', // 'reticle' | 'circuit' | 'waveform' | 'geometric-burst'
  size = 280,
  strokeWidth = 2,
  color = '#06B6D4',
  glowColor = 'rgba(6, 182, 212, 0.6)',
  durationInFrames = 30,
  delay = 0,
  style = {}
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Eased cubic drawing progress
  const eased = 1 - Math.pow(1 - progress, 3);
  const pathLength = 600;
  const strokeDashoffset = pathLength * (1 - eased);

  const renderPaths = () => {
    switch (pathType) {
      case 'circuit':
        return (
          <>
            <path
              d="M 20 100 L 70 100 L 100 70 L 140 70 L 160 90 L 190 90 M 100 70 L 100 30 L 130 30"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            <circle cx="190" cy="90" r="4" fill={color} opacity={eased > 0.8 ? 1 : 0} />
            <circle cx="130" cy="30" r="4" fill={color} opacity={eased > 0.9 ? 1 : 0} />
          </>
        );
      case 'waveform':
        return (
          <path
            d="M 10 100 Q 35 30 60 100 T 110 100 T 160 100 T 210 100 T 260 100"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        );
      case 'geometric-burst':
        return (
          <g transform={`rotate(${frame * 0.4} 100 100)`}>
            <polygon
              points="100,20 120,80 180,100 120,120 100,180 80,120 20,100 80,80"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
            />
          </g>
        );
      case 'reticle':
      default:
        return (
          <>
            {/* Center target ring */}
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray="440"
              strokeDashoffset={440 * (1 - eased)}
            />
            {/* Crosshair extensions */}
            <line
              x1="100" y1="10" x2="100" y2="40"
              stroke={color} strokeWidth={strokeWidth}
              strokeDasharray="30" strokeDashoffset={30 * (1 - eased)}
            />
            <line
              x1="100" y1="160" x2="100" y2="190"
              stroke={color} strokeWidth={strokeWidth}
              strokeDasharray="30" strokeDashoffset={30 * (1 - eased)}
            />
            <line
              x1="10" y1="100" x2="40" y2="100"
              stroke={color} strokeWidth={strokeWidth}
              strokeDasharray="30" strokeDashoffset={30 * (1 - eased)}
            />
            <line
              x1="160" y1="100" x2="190" y2="100"
              stroke={color} strokeWidth={strokeWidth}
              strokeDasharray="30" strokeDashoffset={30 * (1 - eased)}
            />
          </>
        );
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
        filter: `drop-shadow(0 0 10px ${glowColor})`,
        ...style
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        {renderPaths()}
      </svg>
    </div>
  );
};

