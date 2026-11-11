import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const AnimatedCounter = ({
  from = 0,
  to = 100,
  durationInFrames = 45,
  delay = 5,
  prefix = '',
  suffix = '%',
  label = 'METRIC',
  showRadialGauge = true,
  gaugeRadius = 36,
  color = '#8B5CF6',
  fontSize = '44px',
  showCard = true,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 }
  });
  const cardScale = interpolate(spr, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(spr, [0, 1], [0, 1]);
  const cardTranslateY = interpolate(spr, [0, 1], [35, 0]);

  // Interpolated progress with cubic deceleration easing
  const progress = interpolate(
    frame - (delay + 5),
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Eased progress (outQuart)
  const easedProgress = 1 - Math.pow(1 - progress, 4);
  const currentVal = from + (to - from) * easedProgress;
  const isInteger = Number.isInteger(to) && Number.isInteger(from);
  const displayVal = isInteger ? Math.round(currentVal) : currentVal.toFixed(1);

  // Circumference for radial gauge
  const circumference = 2 * Math.PI * gaugeRadius;
  const strokeOffset = circumference * (1 - Math.min(1, Math.max(0, easedProgress)));

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {showRadialGauge && (
        <div style={{ position: 'relative', width: `${gaugeRadius * 2 + 16}px`, height: `${gaugeRadius * 2 + 16}px`, marginBottom: '12px' }}>
          <svg width={gaugeRadius * 2 + 16} height={gaugeRadius * 2 + 16} viewBox={`0 0 ${gaugeRadius * 2 + 16} ${gaugeRadius * 2 + 16}`}>
            {/* Background track */}
            <circle
              cx={gaugeRadius + 8}
              cy={gaugeRadius + 8}
              r={gaugeRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="6"
            />
            {/* Animated progress arc */}
            <circle
              cx={gaugeRadius + 8}
              cy={gaugeRadius + 8}
              r={gaugeRadius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${gaugeRadius + 8} ${gaugeRadius + 8})`}
              style={{
                filter: `drop-shadow(0 0 8px ${color})`,
                transition: 'stroke-dashoffset 0.05s linear'
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#94A3B8',
              fontWeight: 600
            }}
          >
            {Math.round(easedProgress * 100)}%
          </div>
        </div>
      )}

      {/* Number Value */}
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          textShadow: `0 0 20px ${color}88`,
          willChange: 'transform'
        }}
      >
        <span>{prefix}</span>
        <span>{displayVal}</span>
        <span>{suffix}</span>
      </div>

      {/* Label */}
      {label && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#94A3B8',
            textTransform: 'uppercase'
          }}
        >
          {label}
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return (
      <div style={{ transform: `scale(${cardScale}) translateY(${cardTranslateY}px)`, opacity: cardOpacity, ...style }}>
        {content}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px 28px',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${color}44`,
        borderRadius: '18px',
        boxShadow: `0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px ${color}22`,
        transform: `scale(${cardScale}) translateY(${cardTranslateY}px)`,
        opacity: cardOpacity,
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {content}
    </div>
  );
};

