import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { ParticleField } from '../components/ParticleField';
import { GlowingOrb } from '../components/GlowingOrb';
import { CyberRing } from '../components/AnimatedSvgShapes';
import { KineticHeadline, KineticSubtitle, KineticBadge } from '../components/KineticTypography';

export const KineticTitleScene = ({ scene, project, isVertical = false }) => {
  const accent = scene.colorPalette?.accent || project?.theme?.primaryColor || '#3B82F6';
  const secondary = project?.theme?.secondaryColor || '#8B5CF6';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.colorPalette?.bg || '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isVertical ? '4rem 2rem' : '4rem 6rem',
        position: 'relative'
      }}
    >
      {scene.visualElements?.showGrid && <GridBackground color={accent} isVertical={isVertical} />}
      {scene.visualElements?.showParticles && <ParticleField count={isVertical ? 20 : 35} color={accent} />}
      {scene.visualElements?.showOrb && <GlowingOrb color1={accent} color2={secondary} size={isVertical ? 400 : 650} />}

      {/* Background Graphic Decor */}
      <div
        style={{
          position: 'absolute',
          opacity: 0.25,
          pointerEvents: 'none',
          transform: isVertical ? 'scale(0.8)' : 'scale(1.2)'
        }}
      >
        <CyberRing size={320} color={accent} secondaryColor={secondary} />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: isVertical ? '90%' : '1200px'
        }}
      >
        <KineticBadge text={scene.badge} accentColor={accent} delayFrames={3} />
        <KineticHeadline
          text={scene.heading}
          accentColor={accent}
          fontSize={isVertical ? '48px' : '76px'}
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

