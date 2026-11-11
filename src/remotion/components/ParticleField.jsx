import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const ParticleField = ({ count = 25, color = '#60A5FA' }) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: (i * 37) % 100,
      baseY: (i * 23) % 100,
      size: 2 + ((i * 7) % 5),
      speed: 0.15 + ((i * 3) % 4) * 0.1,
      delay: (i * 11) % 60,
      alpha: 0.2 + ((i * 5) % 6) * 0.12
    }));
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p, idx) => {
        const y = (p.baseY - (frame * p.speed)) % 110;
        const normalizedY = y < -10 ? y + 120 : y;
        const opacity = interpolate(
          Math.sin((frame + p.delay) * 0.08),
          [-1, 1],
          [p.alpha * 0.4, p.alpha]
        );

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${normalizedY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
              opacity
            }}
          />
        );
      })}
    </div>
  );
};

