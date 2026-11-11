import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { GlowingOrb } from '../components/GlowingOrb';
import { CyberRing } from '../components/AnimatedSvgShapes';
import { KineticHeadline, KineticSubtitle, KineticBadge } from '../components/KineticTypography';

export const IsometricBadgeScene = ({ scene, project, isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = scene.colorPalette?.accent || '#8B5CF6';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  const spr = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 90 }
  });

  const floatY = Math.sin(frame * 0.08) * 12;
  const rotateX = interpolate(spr, [0, 1], [40, 15]);
  const rotateY = interpolate(spr, [0, 1], [-45, -20]);
  const scale = interpolate(spr, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.colorPalette?.bg || '#090D1C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isVertical ? '3rem 1.5rem' : '4rem 5rem',
        position: 'relative'
      }}
    >
      <GridBackground color={accent} opacity={0.14} isVertical={isVertical} />
      <GlowingOrb color1={accent} color2="#3B82F6" size={isVertical ? 400 : 600} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: isVertical ? '90%' : '1100px'
        }}
      >
        <KineticBadge text={scene.badge || 'PRODUCTION ARCHITECTURE'} accentColor={accent} delayFrames={2} />

        {/* 3D Isometric Floating Card */}
        <div
          style={{
            perspective: '1200px',
            marginBottom: '2rem',
            transform: `translateY(${floatY}px)`
          }}
        >
          <div
            style={{
              width: isVertical ? '280px' : '360px',
              height: isVertical ? '180px' : '220px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: `2px solid ${accent}`,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 35px ${accent}44`,
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
              transformStyle: 'preserve-3d',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              position: 'relative'
            }}
          >
            {/* Inner Cyber Graphic */}
            <div style={{ position: 'absolute', opacity: 0.35, pointerEvents: 'none' }}>
              <CyberRing size={180} color={accent} secondaryColor="#3B82F6" />
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: `${accent}25`,
                border: `1px solid ${accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${accent}66`,
                marginBottom: '12px'
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>

            <div
              style={{
                color: '#FFFFFF',
                fontFamily: 'Space Grotesk',
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              HIGH CONVERTING
            </div>
            <div
              style={{
                color: '#94A3B8',
                fontSize: '12px',
                fontWeight: 600,
                marginTop: '4px'
              }}
            >
              PROVEN RETENTION CURVE
            </div>
          </div>
        </div>

        <KineticHeadline
          text={scene.heading}
          accentColor={accent}
          fontSize={isVertical ? '42px' : '64px'}
          fontFamily={headingFont}
        />
        <KineticSubtitle
          text={scene.subheading}
          delayFrames={14}
          fontFamily={bodyFont}
          color={scene.colorPalette?.textSecondary || '#94A3B8'}
        />
      </div>
    </AbsoluteFill>
  );
};

