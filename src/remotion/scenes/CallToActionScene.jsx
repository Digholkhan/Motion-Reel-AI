import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { GlowingOrb } from '../components/GlowingOrb';
import { ParticleField } from '../components/ParticleField';
import { KineticHeadline, KineticSubtitle, KineticBadge } from '../components/KineticTypography';

export const CallToActionScene = ({ scene, project, isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = scene.colorPalette?.accent || '#8B5CF6';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  // Pulse animation for the button
  const pulseScale = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.98, 1.05]);

  const spr = spring({
    frame: frame - 16,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 120 }
  });

  const btnTranslateY = interpolate(spr, [0, 1], [40, 0]);
  const btnOpacity = interpolate(spr, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.colorPalette?.bg || '#0B0F19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isVertical ? '3rem 1.5rem' : '4rem 5rem',
        position: 'relative'
      }}
    >
      <GridBackground color={accent} opacity={0.18} isVertical={isVertical} />
      <ParticleField count={30} color={accent} />
      <GlowingOrb color1={accent} color2="#3B82F6" size={isVertical ? 450 : 700} />

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
        <KineticBadge text={scene.badge || 'GET STARTED NOW'} accentColor={accent} delayFrames={2} />

        <KineticHeadline
          text={scene.heading}
          accentColor={accent}
          fontSize={isVertical ? '46px' : '72px'}
          fontFamily={headingFont}
        />

        <KineticSubtitle
          text={scene.subheading}
          delayFrames={10}
          fontFamily={bodyFont}
          color={scene.colorPalette?.textSecondary || '#CBD5E1'}
        />

        {/* Action Button */}
        <div
          style={{
            marginTop: isVertical ? '2.5rem' : '3rem',
            transform: `translateY(${btnTranslateY}px) scale(${pulseScale})`,
            opacity: btnOpacity
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: isVertical ? '16px 36px' : '20px 48px',
              borderRadius: '9999px',
              background: `linear-gradient(135deg, ${accent} 0%, #3B82F6 100%)`,
              color: '#FFFFFF',
              fontFamily: 'Space Grotesk',
              fontWeight: 800,
              fontSize: isVertical ? '18px' : '22px',
              letterSpacing: '0.04em',
              boxShadow: `0 0 35px ${accent}88, 0 10px 25px rgba(0,0,0,0.5)`,
              cursor: 'pointer'
            }}
          >
            <span>START GENERATING</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

