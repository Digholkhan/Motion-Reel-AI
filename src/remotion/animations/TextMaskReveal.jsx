import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const TextMaskReveal = ({
  text = '',
  delay = 0,
  durationInFrames = 25,
  direction = 'left-to-right', // 'left-to-right' | 'bottom-to-top' | 'center-out'
  fontSize = '48px',
  fontWeight = 800,
  fontFamily = 'Space Grotesk',
  color = '#FFFFFF',
  accentColor = '#3B82F6',
  showAccentBar = true,
  style = {}
}) => {
  const frame = useCurrentFrame();

  const isBengali = /[\u0980-\u09FF]/.test(text || '');
  const activeFont = isBengali ? `'Hind Siliguri', 'Inter', sans-serif` : `${fontFamily}, sans-serif`;

  const progress = interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  let clipPath = '';
  let barStyle = {};

  if (direction === 'left-to-right') {
    clipPath = `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`;
    barStyle = {
      position: 'absolute',
      left: `${progress}%`,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: accentColor,
      boxShadow: `0 0 12px ${accentColor}`,
      opacity: progress < 100 ? 1 : 0
    };
  } else if (direction === 'bottom-to-top') {
    const bottomInset = 100 - progress;
    clipPath = `inset(0 0 ${bottomInset}% 0)`;
    barStyle = {
      position: 'absolute',
      bottom: `${bottomInset}%`,
      left: 0,
      right: 0,
      height: '3px',
      backgroundColor: accentColor,
      boxShadow: `0 0 12px ${accentColor}`,
      opacity: progress < 100 ? 1 : 0
    };
  } else {
    // center-out
    const insetH = (100 - progress) / 2;
    clipPath = `inset(0 ${insetH}% 0 ${insetH}%)`;
    barStyle = { display: 'none' };
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', ...style }}>
      <div
        style={{
          fontFamily: activeFont,
          fontSize,
          fontWeight,
          color,
          letterSpacing: isBengali ? '0' : '-0.02em',
          lineHeight: 1.2,
          clipPath,
          willChange: 'clip-path'
        }}
      >
        {text}
      </div>

      {showAccentBar && progress > 0 && progress < 100 && (
        <div style={barStyle} />
      )}
    </div>
  );
};

