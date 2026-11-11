import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { GlowingOrb } from '../components/GlowingOrb';
import { ParticleField } from '../components/ParticleField';
import { KineticHeadline, KineticSubtitle, KineticBadge } from '../components/KineticTypography';

const renderFeatureIcon = (type, color = '#3B82F6') => {
  switch (type) {
    case 'video':
    case 'monitor':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      );
    case 'smartphone':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <line x1="12" x2="12.01" y1="18" y2="18" />
        </svg>
      );
    case 'volume-2':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      );
    case 'type':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" x2="15" y1="20" y2="20" />
          <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
};

const FeatureCard = ({ item, index, accent, isVertical, fps }) => {
  const frame = useCurrentFrame();

  const spr = spring({
    frame: frame - (12 + index * 6),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 110 }
  });

  const translateY = interpolate(spr, [0, 1], [50, 0]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);
  const scale = interpolate(spr, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        flex: 1,
        minWidth: isVertical ? '100%' : '260px',
        maxWidth: isVertical ? '100%' : '360px',
        padding: '28px 24px',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderTop: `2px solid ${accent}`,
        borderRadius: '16px',
        boxShadow: `0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px ${accent}22`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${accent}18`,
          border: `1px solid ${accent}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        {renderFeatureIcon(item.icon, accent)}
      </div>

      <div
        style={{
          fontSize: '20px',
          fontWeight: 700,
          fontFamily: 'Space Grotesk',
          color: '#FFFFFF',
          marginBottom: '8px'
        }}
      >
        {item.title}
      </div>

      <div
        style={{
          fontSize: '14px',
          lineHeight: 1.5,
          color: '#94A3B8',
          fontFamily: 'Inter'
        }}
      >
        {item.description}
      </div>
    </div>
  );
};

export const FeatureCardsScene = ({ scene, project, isVertical = false }) => {
  const { fps } = useVideoConfig();
  const accent = scene.colorPalette?.accent || '#3B82F6';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  const defaultFeatures = [
    { title: 'Generative Precision', description: 'Real-time vector calculation with zero rendering artifacts', icon: 'zap' },
    { title: 'Dynamic Layouts', description: 'Fluidly morphs between 16:9, 9:16 and 1:1 ratios', icon: 'monitor' },
    { title: 'Audio Synchronized', description: 'Beats and kinetic typography lock together automatically', icon: 'volume-2' }
  ];

  const features = (scene.features && scene.features.length > 0) ? scene.features : defaultFeatures;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.colorPalette?.bg || '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isVertical ? '3rem 1.5rem' : '4rem 5rem',
        position: 'relative'
      }}
    >
      <GridBackground color={accent} opacity={0.12} isVertical={isVertical} />
      <ParticleField count={20} color={accent} />
      <GlowingOrb color1={accent} color2="#8B5CF6" size={550} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isVertical ? '90%' : '1200px'
        }}
      >
        <KineticBadge text={scene.badge || 'CORE CAPABILITIES'} accentColor={accent} delayFrames={2} />
        <KineticHeadline
          text={scene.heading}
          accentColor={accent}
          fontSize={isVertical ? '42px' : '64px'}
          fontFamily={headingFont}
        />
        <KineticSubtitle
          text={scene.subheading}
          delayFrames={10}
          fontFamily={bodyFont}
          color={scene.colorPalette?.textSecondary || '#94A3B8'}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            gap: isVertical ? '14px' : '24px',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'stretch',
            marginTop: isVertical ? '2rem' : '3rem'
          }}
        >
          {features.map((feat, idx) => (
            <FeatureCard
              key={idx}
              item={feat}
              index={idx}
              accent={accent}
              isVertical={isVertical}
              fps={fps}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

