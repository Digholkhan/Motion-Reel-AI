import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { HudBrackets, ScannerLine, EqualizerBars, CyberRing } from '../components/AnimatedSvgShapes';
import { KineticHeadline, KineticSubtitle, KineticBadge } from '../components/KineticTypography';

export const TechHudScene = ({ scene, project, isVertical = false }) => {
  const frame = useCurrentFrame();
  const accent = scene.colorPalette?.accent || '#06B6D4';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  const timecode = `00:${String(Math.floor(frame / 30)).padStart(2, '0')}:${String(frame % 30).padStart(2, '0')}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.colorPalette?.bg || '#080D1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isVertical ? '3rem 1.5rem' : '4rem 5rem',
        position: 'relative'
      }}
    >
      <GridBackground color={accent} opacity={0.12} isVertical={isVertical} />
      <ScannerLine color={accent} />

      {/* Cyber HUD Brackets */}
      <div style={{ position: 'absolute', inset: isVertical ? '20px' : '40px', pointerEvents: 'none' }}>
        <HudBrackets color={accent} length={isVertical ? 30 : 60} stroke={2} />

        {/* Top HUD Metadata */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: accent,
            letterSpacing: '0.1em'
          }}
        >
          <span>SYS.LATENCY: 0.12ms</span>
          <span>•</span>
          <span>TC: {timecode}</span>
        </div>

        {/* Top Right Equalizer */}
        <div style={{ position: 'absolute', top: 10, right: 20 }}>
          <EqualizerBars count={6} color={accent} height={20} />
        </div>

        {/* Bottom Left Coordinate */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 20,
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#64748B'
          }}
        >
          COORDINATES: 48.8566° N, 2.3522° E // VECTOR READY
        </div>
      </div>

      {/* Center Reticle Decor */}
      <div
        style={{
          position: 'absolute',
          opacity: 0.35,
          pointerEvents: 'none',
          transform: isVertical ? 'scale(0.7)' : 'scale(1)'
        }}
      >
        <CyberRing size={280} color={accent} secondaryColor="#3B82F6" />
      </div>

      {/* Content */}
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
        <KineticBadge text={scene.badge || 'CYBER PROTOCOL ACTIVE'} accentColor={accent} delayFrames={2} />
        <KineticHeadline
          text={scene.heading}
          accentColor={accent}
          fontSize={isVertical ? '44px' : '68px'}
          fontFamily={headingFont}
        />
        <KineticSubtitle
          text={scene.subheading}
          delayFrames={12}
          fontFamily={bodyFont}
          color={scene.colorPalette?.textSecondary || '#94A3B8'}
        />
      </div>
    </AbsoluteFill>
  );
};

