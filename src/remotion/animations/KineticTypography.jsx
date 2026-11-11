import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WordReveal } from './WordReveal';

export const KineticTypography = ({
  headline = '',
  subheadline = '',
  badge = '',
  preset = 'energetic', // 'energetic' | 'cyber' | 'smooth' | 'dramatic' | 'minimal'
  accentColor = '#3B82F6',
  secondaryColor = '#8B5CF6',
  highlightWords = [],
  fontSize = '68px',
  fontFamily = 'Space Grotesk',
  align = 'center',
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isBengali = /[\u0980-\u09FF]/.test(headline + ' ' + subheadline);

  // Preset physics profiles
  const springProfiles = {
    energetic: { damping: 11, mass: 0.5, stiffness: 140 },
    cyber: { damping: 16, mass: 0.7, stiffness: 180 },
    smooth: { damping: 20, mass: 1.0, stiffness: 80 },
    dramatic: { damping: 14, mass: 1.2, stiffness: 60 },
    minimal: { damping: 25, mass: 1.0, stiffness: 100 }
  };
  const activeSpringConfig = springProfiles[preset] || springProfiles.energetic;

  // Badge spring
  const badgeSpr = spring({
    frame: frame - 3,
    fps,
    config: { damping: 14, mass: 0.4, stiffness: 150 }
  });
  const badgeScale = interpolate(badgeSpr, [0, 1], [0.6, 1]);
  const badgeOpacity = interpolate(badgeSpr, [0, 1], [0, 1]);

  // Subheadline spring
  const subSpr = spring({
    frame: frame - 14,
    fps,
    config: activeSpringConfig
  });
  const subTranslateY = interpolate(subSpr, [0, 1], [30, 0]);
  const subOpacity = interpolate(subSpr, [0, 1], [0, 1]);

  // Subtle continuous 3D tilt tracking
  const continuousSkew = preset === 'cyber' ? Math.sin(frame * 0.05) * 1.5 : 0;
  const continuousFloat = Math.sin(frame * 0.06) * 3;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
        textAlign: align,
        transform: `translateY(${continuousFloat}px) skewX(${continuousSkew}deg)`,
        position: 'relative',
        zIndex: 10,
        ...style
      }}
    >
      {/* Floating Kinetic Badge */}
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: `1px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}44`,
            transform: `scale(${badgeScale})`,
            opacity: badgeOpacity,
            marginBottom: '1.25rem',
            willChange: 'transform, opacity'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: isBengali ? "'Hind Siliguri', sans-serif" : 'Space Grotesk, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: isBengali ? '0' : '0.08em',
              textTransform: isBengali ? 'none' : 'uppercase'
            }}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Primary Headline with WordReveal */}
      <WordReveal
        text={headline}
        delay={4}
        staggerDelay={preset === 'energetic' ? 3 : 4}
        direction={preset === 'dramatic' ? 'down' : 'up'}
        springConfig={activeSpringConfig}
        color="#FFFFFF"
        highlightColor={accentColor}
        highlightWords={highlightWords}
        fontSize={fontSize}
        fontFamily={fontFamily}
        textAlign={align}
      />

      {/* Subheadline with Smooth Reveal */}
      {subheadline && (
        <p
          style={{
            fontFamily: isBengali ? "'Hind Siliguri', 'Inter', sans-serif" : 'Inter, sans-serif',
            fontSize: '22px',
            fontWeight: 500,
            color: '#94A3B8',
            letterSpacing: isBengali ? '0' : '0.03em',
            maxWidth: '850px',
            margin: '1.25rem 0 0 0',
            transform: `translateY(${subTranslateY}px)`,
            opacity: subOpacity,
            lineHeight: 1.5,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            willChange: 'transform, opacity'
          }}
        >
          {subheadline}
        </p>
      )}
    </div>
  );
};

