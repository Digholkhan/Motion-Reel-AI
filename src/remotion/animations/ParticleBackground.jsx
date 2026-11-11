import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const ParticleBackground = ({
  count = 24,
  color = '#3B82F6',
  speed = 0.25,
  maxSize = 4,
  depthLevels = 3,
  style = {}
}) => {
  const frame = useCurrentFrame();

  // Deterministically precomputed particles to preserve CPU & RAM
  const particles = useMemo(() => {
    return Array.from({ length: Math.min(40, count) }).map((_, i) => {
      const depth = (i % depthLevels) + 1;
      return {
        id: i,
        x: (i * 47) % 100,
        baseY: (i * 31) % 100,
        size: Math.max(1.5, (maxSize * depth) / depthLevels),
        speed: speed * (0.5 + (depth * 0.4)),
        alpha: (0.15 + (depth * 0.15)),
        driftSpeed: 0.04 + (i % 3) * 0.02,
        driftRadius: 4 + (i % 4) * 3
      };
    });
  }, [count, speed, maxSize, depthLevels]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        ...style
      }}
    >
      {particles.map((p) => {
        // Continuous upward drift
        const rawY = (p.baseY - (frame * p.speed)) % 110;
        const y = rawY < -10 ? rawY + 120 : rawY;
        const xOffset = Math.sin(frame * p.driftSpeed + p.id) * p.driftRadius;
        const currentX = p.x + (xOffset * 0.2);

        const opacity = interpolate(
          Math.sin(frame * 0.08 + p.id),
          [-1, 1],
          [p.alpha * 0.4, p.alpha]
        );

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${currentX}%`,
              top: `${y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
              opacity,
              willChange: 'transform, opacity'
            }}
          />
        );
      })}
    </div>
  );
};

