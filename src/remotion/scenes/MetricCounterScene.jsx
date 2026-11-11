import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { GlowingOrb } from '../components/GlowingOrb';
import { KineticHeadline, KineticSubtitle, KineticBadge } from '../components/KineticTypography';

const AnimatedMetricCard = ({ metric, index, accent, isVertical, fps }) => {
  const frame = useCurrentFrame();

  const spr = spring({
    frame: frame - (10 + index * 6),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 100 }
  });

  const scale = interpolate(spr, [0, 1], [0.8, 1]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);
  const translateY = interpolate(spr, [0, 1], [40, 0]);

  // Interpolate counter value
  const progress = interpolate(frame - (15 + index * 5), [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const target = metric.targetNumber || 100;
  const currentVal = Math.round(progress * target * 10) / 10;
  const displayVal = metric.prefix + (target % 1 === 0 ? Math.round(currentVal) : currentVal.toFixed(1)) + metric.suffix;

  return (
    <div
      style={{
        flex: 1,
        minWidth: isVertical ? '100%' : '260px',
        maxWidth: isVertical ? '100%' : '340px',
        padding: '24px 20px',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${accent}55`,
        borderRadius: '16px',
        boxShadow: `0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${accent}22`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity
      }}
    >
      {/* Animated Circular Gauge */}
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '12px' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={accent}
            strokeWidth="6"
            strokeDasharray="213.6"
            strokeDashoffset={213.6 * (1 - Math.min(1, progress * 0.9 + 0.1))}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
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
            color: '#CBD5E1'
          }}
        >
          {Math.round(progress * 100)}%
        </div>
      </div>

      <div
        style={{
          fontSize: '38px',
          fontWeight: 900,
          fontFamily: 'Space Grotesk',
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          textShadow: `0 0 15px ${accent}88`
        }}
      >
        {displayVal}
      </div>

      <div
        style={{
          marginTop: '6px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#94A3B8',
          textTransform: 'uppercase'
        }}
      >
        {metric.label}
      </div>
    </div>
  );
};

export const MetricCounterScene = ({ scene, project, isVertical = false }) => {
  const { fps } = useVideoConfig();
  const accent = scene.colorPalette?.accent || '#8B5CF6';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  const defaultMetrics = [
    { label: 'PERFORMANCE', value: '10x', targetNumber: 10, suffix: 'x', prefix: '' },
    { label: 'EFFICIENCY', value: '88%', targetNumber: 88, suffix: '%', prefix: '+' },
    { label: 'ACCURACY', value: '99%', targetNumber: 99, suffix: '%', prefix: '' }
  ];

  const metrics = (scene.metrics && scene.metrics.length > 0) ? scene.metrics : defaultMetrics;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.colorPalette?.bg || '#0A0E1D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isVertical ? '3rem 1.5rem' : '4rem 5rem',
        position: 'relative'
      }}
    >
      <GridBackground color={accent} opacity={0.15} isVertical={isVertical} />
      <GlowingOrb color1={accent} color2="#3B82F6" size={isVertical ? 450 : 600} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isVertical ? '90%' : '1200px'
        }}
      >
        <KineticBadge text={scene.badge || 'PROVEN METRICS'} accentColor={accent} delayFrames={2} />
        <KineticHeadline
          text={scene.heading}
          accentColor={accent}
          fontSize={isVertical ? '42px' : '64px'}
          fontFamily={headingFont}
        />
        <KineticSubtitle
          text={scene.subheading}
          delayFrames={10}
          fontFamily={bodyFont}
          color={scene.colorPalette?.textSecondary || '#CBD5E1'}
        />

        {/* Metric Cards Row / Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            gap: isVertical ? '14px' : '24px',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: isVertical ? '2rem' : '3rem'
          }}
        >
          {metrics.map((m, idx) => (
            <AnimatedMetricCard
              key={idx}
              metric={m}
              index={idx}
              accent={accent}
              isVertical={isVertical}
              fps={fps}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

