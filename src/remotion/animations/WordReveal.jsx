import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const WordReveal = ({
  text = '',
  delay = 0,
  staggerDelay = 3,
  direction = 'up', // 'up' | 'down' | 'left' | 'scale'
  springConfig = { damping: 12, mass: 0.5, stiffness: 120 },
  color = '#FFFFFF',
  highlightColor = '#3B82F6',
  highlightWords = [],
  fontSize = '64px',
  fontWeight = 800,
  fontFamily = 'Space Grotesk',
  textAlign = 'center',
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = (text || '').trim().split(/\s+/);
  const isBengali = /[\u0980-\u09FF]/.test(text || '');
  const activeFont = isBengali ? `'Hind Siliguri', 'Inter', sans-serif` : `${fontFamily}, sans-serif`;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
        gap: '0.28em',
        fontFamily: activeFont,
        fontSize,
        fontWeight,
        lineHeight: 1.15,
        letterSpacing: isBengali ? '0' : '-0.02em',
        textTransform: isBengali ? 'none' : 'uppercase',
        margin: 0,
        ...style
      }}
    >
      {words.map((word, idx) => {
        const wordDelay = delay + (idx * staggerDelay);
        const spr = spring({
          frame: frame - wordDelay,
          fps,
          config: springConfig
        });

        // Directional transforms
        let transform = '';
        if (direction === 'up') {
          const y = interpolate(spr, [0, 1], [60, 0]);
          const scale = interpolate(spr, [0, 1], [0.85, 1]);
          transform = `translateY(${y}px) scale(${scale})`;
        } else if (direction === 'down') {
          const y = interpolate(spr, [0, 1], [-60, 0]);
          const scale = interpolate(spr, [0, 1], [0.85, 1]);
          transform = `translateY(${y}px) scale(${scale})`;
        } else if (direction === 'left') {
          const x = interpolate(spr, [0, 1], [50, 0]);
          transform = `translateX(${x}px)`;
        } else if (direction === 'scale') {
          const scale = interpolate(spr, [0, 1], [0.2, 1]);
          transform = `scale(${scale})`;
        }

        const opacity = interpolate(spr, [0, 1], [0, 1]);

        // Check if word should be highlighted
        const cleanWord = word.replace(/[^\w\u0980-\u09FF]/g, '').toLowerCase();
        const isHighlight = highlightWords.some(hw => hw.toLowerCase().includes(cleanWord)) ||
          (highlightWords.length === 0 && (idx === 0 || idx === words.length - 1));

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              transform,
              opacity,
              color: isHighlight ? highlightColor : color,
              textShadow: isHighlight
                ? `0 0 25px ${highlightColor}88, 0 4px 15px rgba(0,0,0,0.8)`
                : '0 4px 12px rgba(0,0,0,0.8)',
              willChange: 'transform, opacity'
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

