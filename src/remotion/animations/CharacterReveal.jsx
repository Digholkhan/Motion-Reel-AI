import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const CharacterReveal = ({
  text = '',
  delay = 0,
  staggerFrames = 1.5,
  mode = 'pop', // 'pop' | 'typewriter' | 'fade'
  cursor = true,
  color = '#FFFFFF',
  accentColor = '#06B6D4',
  fontSize = '28px',
  fontWeight = 600,
  fontFamily = 'JetBrains Mono',
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = Array.from(text || '');
  const isBengali = /[\u0980-\u09FF]/.test(text || '');
  const activeFont = isBengali ? `'Hind Siliguri', sans-serif` : `${fontFamily}, monospace`;

  const totalCharsToShow = Math.max(0, Math.floor((frame - delay) / staggerFrames));
  const isComplete = totalCharsToShow >= chars.length;
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        fontFamily: activeFont,
        fontSize,
        fontWeight,
        color,
        letterSpacing: isBengali ? '0' : '0.04em',
        lineHeight: 1.4,
        ...style
      }}
    >
      {chars.map((char, idx) => {
        const charStart = delay + (idx * staggerFrames);
        if (mode === 'typewriter') {
          if (frame < charStart) return null;
          return <span key={idx}>{char === ' ' ? '\u00A0' : char}</span>;
        }

        // 'pop' mode with spring
        const spr = spring({
          frame: frame - charStart,
          fps,
          config: { damping: 14, mass: 0.3, stiffness: 180 }
        });

        const scale = interpolate(spr, [0, 1], [0.3, 1]);
        const opacity = interpolate(spr, [0, 1], [0, 1]);
        const translateY = interpolate(spr, [0, 1], [15, 0]);

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              whiteSpace: 'pre',
              willChange: 'transform, opacity'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}

      {cursor && !isComplete && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: fontSize,
            backgroundColor: accentColor,
            marginLeft: '4px',
            opacity: cursorBlink ? 1 : 0,
            boxShadow: `0 0 8px ${accentColor}`
          }}
        />
      )}
    </div>
  );
};

