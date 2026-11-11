import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const KineticHeadline = ({
  text = '',
  accentColor = '#3B82F6',
  preset = 'energetic',
  fontSize = '72px',
  fontFamily = 'Space Grotesk'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = (text || '').split(' ');

  const isBengali = /[\u0980-\u09FF]/.test(text || '');
  const activeFontFamily = isBengali ? "'Hind Siliguri', 'Inter', sans-serif" : `${fontFamily}, 'Hind Siliguri', sans-serif`;

  return (
    <h1
      style={{
        fontSize,
        fontFamily: activeFontFamily,
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: isBengali ? '0' : '-0.02em',
        textAlign: 'center',
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.25em',
        textTransform: isBengali ? 'none' : 'uppercase'
      }}
    >
      {words.map((word, idx) => {
        const delay = idx * 4;
        const spr = spring({
          frame: frame - delay,
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 120 }
        });

        const translateY = interpolate(spr, [0, 1], [60, 0]);
        const opacity = interpolate(spr, [0, 1], [0, 1]);
        const scale = interpolate(spr, [0, 1], [0.85, 1]);

        const isHighlight = idx === 0 || idx === words.length - 1;

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              color: isHighlight ? '#FFFFFF' : '#E2E8F0',
              textShadow: isHighlight
                ? `0 0 25px ${accentColor}, 0 4px 12px rgba(0,0,0,0.8)`
                : '0 4px 12px rgba(0,0,0,0.8)',
              background: isHighlight
                ? `linear-gradient(135deg, #FFFFFF 30%, ${accentColor} 100%)`
                : undefined,
              WebkitBackgroundClip: isHighlight ? 'text' : undefined,
              WebkitTextFillColor: isHighlight ? 'transparent' : undefined
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
};

export const KineticSubtitle = ({
  text = '',
  delayFrames = 12,
  fontFamily = 'Inter',
  color = '#94A3B8'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 90 }
  });

  const translateY = interpolate(spr, [0, 1], [25, 0]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);

  if (!text) return null;

  const isBengali = /[\u0980-\u09FF]/.test(text || '');
  const activeFontFamily = isBengali ? "'Hind Siliguri', 'Inter', sans-serif" : `${fontFamily}, sans-serif`;

  return (
    <p
      style={{
        fontFamily: activeFontFamily,
        fontSize: '22px',
        fontWeight: 500,
        color,
        letterSpacing: '0.04em',
        textAlign: 'center',
        maxWidth: '850px',
        margin: '1.25rem 0 0 0',
        transform: `translateY(${translateY}px)`,
        opacity,
        lineHeight: 1.5,
        textShadow: '0 2px 10px rgba(0,0,0,0.9)'
      }}
    >
      {text}
    </p>
  );
};

export const KineticBadge = ({
  text = '',
  accentColor = '#3B82F6',
  delayFrames = 4
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 140 }
  });

  const scale = interpolate(spr, [0, 1], [0.7, 1]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);

  if (!text) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 18px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        border: `1px solid ${accentColor}`,
        boxShadow: `0 0 15px ${accentColor}44`,
        transform: `scale(${scale})`,
        opacity,
        marginBottom: '1.25rem'
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`
        }}
      />
      <span
        style={{
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}
      >
        {text}
      </span>
    </div>
  );
};

