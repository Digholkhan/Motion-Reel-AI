import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { resolveAnimationRecipe } from './AnimationRegistry';
import { ParallaxScene } from '../animations/ParallaxScene';
import { DynamicTransition } from '../transitions/DynamicTransition';
import { WordReveal } from '../animations/WordReveal';
import { CharacterReveal } from '../animations/CharacterReveal';
import { KineticTypography } from '../animations/KineticTypography';
import { TextMaskReveal } from '../animations/TextMaskReveal';
import { AnimatedCounter } from '../animations/AnimatedCounter';
import { ShapeMorph } from '../animations/ShapeMorph';
import { SVGDraw } from '../animations/SVGDraw';
import { IconAnimation } from '../animations/IconAnimation';
import { ParticleBackground } from '../animations/ParticleBackground';
import { GradientBackground } from '../animations/GradientBackground';
import { GridBackground } from '../components/GridBackground';
import { HudBrackets, ScannerLine, EqualizerBars, CyberRing } from '../components/AnimatedSvgShapes';

export const DynamicSceneRenderer = ({
  scene,
  project,
  index = 0,
  totalScenes = 5,
  isVertical = false
}) => {
  const { fps } = useVideoConfig();

  const recipe = resolveAnimationRecipe(scene, index, totalScenes);
  const accent = scene.colorPalette?.accent || project?.theme?.primaryColor || '#3B82F6';
  const secondary = project?.theme?.secondaryColor || '#8B5CF6';
  const bg = scene.colorPalette?.bg || project?.theme?.bgColor || '#070B14';
  const headingFont = project?.theme?.fontHeading || 'Space Grotesk';
  const bodyFont = project?.theme?.fontBody || 'Inter';

  const durationInFrames = Math.max(30, Math.round((scene.durationInSeconds || 5) * fps));
  const transitionType = scene.transitionType || scene.transition?.type || recipe.transition;
  const transitionDuration = scene.transition?.durationInFrames || 15;

  const isBengali = /[\u0980-\u09FF]/.test((scene.heading || '') + ' ' + (scene.subheading || ''));
  const keywords = scene.emphasizedKeywords || [];

  // 1. DYNAMIC BACKGROUND LAYER
  const renderBackgroundLayer = () => {
    switch (recipe.background) {
      case 'hud-grid':
        return (
          <>
            <GridBackground color={accent} opacity={0.16} isVertical={isVertical} />
            <ScannerLine color={accent} />
          </>
        );
      case 'particle-field':
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: bg }} />
            <ParticleBackground count={isVertical ? 18 : 28} color={accent} />
          </>
        );
      case 'dark-minimal':
        return (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(30,41,59,0.3) 0%, transparent 70%)' }} />
          </div>
        );
      case 'deep-navy':
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#060B18' }} />
            <GridBackground color={secondary} opacity={0.12} isVertical={isVertical} />
            <ParticleBackground count={16} color={secondary} />
          </>
        );
      case 'gradient-drift':
      default:
        return (
          <>
            <GradientBackground
              color1={bg}
              accentColor={accent}
              secondaryColor={secondary}
              type="mesh"
              glowOpacity={0.38}
            />
            <ParticleBackground count={isVertical ? 16 : 24} color={accent} />
          </>
        );
    }
  };

  // 2. DYNAMIC MIDGROUND GRAPHICAL LAYER
  const renderMidgroundLayer = () => {
    if (recipe.visuals.includes('svg-reticle')) {
      return (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.35 }}>
          <SVGDraw pathType="reticle" size={isVertical ? 320 : 420} color={accent} durationInFrames={25} />
        </div>
      );
    }
    if (recipe.visuals.includes('svg-circuit')) {
      return (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.4 }}>
          <SVGDraw pathType="circuit" size={isVertical ? 340 : 460} color={accent} durationInFrames={30} />
        </div>
      );
    }
    if (recipe.visuals.includes('shape-morph-shield')) {
      return (
        <div style={{ position: 'absolute', left: '50%', top: isVertical ? '35%' : '50%', transform: 'translate(-50%, -50%)', opacity: 0.4 }}>
          <ShapeMorph shape="shield" size={isVertical ? 240 : 340} color={accent} secondaryColor={secondary} />
        </div>
      );
    }
    if (recipe.visuals.includes('orbit-ring')) {
      return (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%) scale(1.15)', opacity: 0.3 }}>
          <CyberRing size={360} color={accent} secondaryColor={secondary} />
        </div>
      );
    }
    if (recipe.visuals.includes('minimal-ring')) {
      return (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.25 }}>
          <ShapeMorph shape="circle" size={280} color={accent} secondaryColor={secondary} />
        </div>
      );
    }
    return null;
  };

  // 3. DYNAMIC FOREGROUND CONTENT LAYER
  const renderForegroundLayer = () => {
    const headingSize = isVertical ? '44px' : '68px';

    // Recipe 1 & 7: Cyber Telemetry / HUD Layout
    if (recipe.id === 'CYBER_PUNCH' || recipe.id === 'DATA_TELEMETRY') {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '2rem' : '4rem' }}>
          <div style={{ position: 'absolute', inset: isVertical ? '15px' : '30px', pointerEvents: 'none' }}>
            <HudBrackets color={accent} length={isVertical ? 25 : 50} stroke={2} />
            <div style={{ position: 'absolute', top: 10, left: 15, fontFamily: 'monospace', fontSize: '11px', color: accent, letterSpacing: '0.1em' }}>
              PROTOCOL // {recipe.id} • {scene.archetype}
            </div>
            <div style={{ position: 'absolute', top: 10, right: 15 }}>
              <EqualizerBars count={5} color={accent} height={18} />
            </div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: isVertical ? '90%' : '1100px', zIndex: 10 }}>
            {scene.badge && (
              <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <CharacterReveal text={scene.badge} delay={2} mode="typewriter" color={accent} fontSize="13px" />
              </div>
            )}
            <WordReveal
              text={scene.heading}
              delay={6}
              staggerDelay={3}
              direction="up"
              color="#FFFFFF"
              highlightColor={accent}
              highlightWords={keywords}
              fontSize={headingSize}
              fontFamily={headingFont}
            />
            {scene.subheading && (
              <div style={{ marginTop: '1.25rem' }}>
                <CharacterReveal
                  text={scene.subheading}
                  delay={16}
                  staggerFrames={1}
                  mode="typewriter"
                  color="#94A3B8"
                  fontSize={isVertical ? '16px' : '20px'}
                  cursor={false}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Recipe 3: Metric Accelerator
    if (recipe.id === 'METRIC_ACCELERATOR') {
      const primaryMetric = (scene.metrics && scene.metrics[0]) || { label: 'GROWTH', targetNumber: 99, suffix: '%' };
      const secondaryMetrics = (scene.metrics || []).slice(1);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: isVertical ? '90%' : '1100px' }}>
          {scene.badge && (
            <div style={{ marginBottom: '1rem', color: accent, fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em' }}>
              ⚡ {scene.badge}
            </div>
          )}
          <WordReveal
            text={scene.heading}
            delay={2}
            direction="down"
            color="#FFFFFF"
            highlightColor={accent}
            highlightWords={keywords}
            fontSize={isVertical ? '38px' : '56px'}
            fontFamily={headingFont}
          />
          <div style={{ marginTop: isVertical ? '1.5rem' : '2.5rem', display: 'flex', flexDirection: isVertical ? 'column' : 'row', gap: '20px', alignItems: 'center' }}>
            <AnimatedCounter
              to={primaryMetric.targetNumber || 99}
              prefix={primaryMetric.prefix || ''}
              suffix={primaryMetric.suffix || '%'}
              label={primaryMetric.label || 'PERFORMANCE'}
              color={accent}
              delay={8}
              durationInFrames={40}
              showRadialGauge={true}
              gaugeRadius={isVertical ? 32 : 44}
              fontSize={isVertical ? '38px' : '52px'}
            />
            {secondaryMetrics.map((sm, smIdx) => (
              <AnimatedCounter
                key={smIdx}
                to={sm.targetNumber || 80}
                prefix={sm.prefix || ''}
                suffix={sm.suffix || '%'}
                label={sm.label || 'METRIC'}
                color={secondary}
                delay={14 + smIdx * 6}
                durationInFrames={40}
                showRadialGauge={false}
                fontSize={isVertical ? '32px' : '42px'}
              />
            ))}
          </div>
        </div>
      );
    }

    // Recipe 4: Isometric Floating Shield
    if (recipe.id === 'ISOMETRIC_SHIELD') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: isVertical ? '90%' : '1100px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <IconAnimation icon="shield" animationType="float" color={accent} size={isVertical ? 64 : 84} delay={4} />
          </div>
          <TextMaskReveal
            text={scene.heading}
            delay={6}
            durationInFrames={22}
            direction="left-to-right"
            color="#FFFFFF"
            accentColor={accent}
            fontSize={headingSize}
            fontFamily={headingFont}
          />
          {scene.subheading && (
            <p style={{ marginTop: '1rem', color: '#94A3B8', fontSize: '20px', maxWidth: '750px', lineHeight: 1.5, fontFamily: isBengali ? "'Hind Siliguri', sans-serif" : bodyFont }}>
              {scene.subheading}
            </p>
          )}
        </div>
      );
    }

    // Recipe 5: Feature Trio
    if (recipe.id === 'FEATURE_TRIO') {
      const defaultFeatures = [
        { title: 'Generative Precision', description: 'Zero manual keyframing required', icon: 'zap' },
        { title: 'Audio Cadence', description: 'Locked to speech waveform beats', icon: 'volume-2' },
        { title: 'Universal Export', description: 'Native H.264 MP4 rendering', icon: 'monitor' }
      ];
      const feats = (scene.features && scene.features.length > 0) ? scene.features : defaultFeatures;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: isVertical ? '90%' : '1200px' }}>
          <WordReveal
            text={scene.heading}
            delay={2}
            direction="up"
            color="#FFFFFF"
            highlightColor={accent}
            highlightWords={keywords}
            fontSize={isVertical ? '38px' : '58px'}
            fontFamily={headingFont}
          />
          <div style={{ display: 'flex', flexDirection: isVertical ? 'column' : 'row', gap: '18px', marginTop: isVertical ? '1.5rem' : '2.5rem', width: '100%', justifyContent: 'center' }}>
            {feats.map((f, fIdx) => (
              <div
                key={fIdx}
                style={{
                  flex: 1,
                  padding: '24px 20px',
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderTop: `2px solid ${accent}`,
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <IconAnimation icon={f.icon || 'zap'} animationType="pulse" color={accent} size={44} delay={8 + fIdx * 5} />
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', fontFamily: headingFont, marginBottom: '6px' }}>
                  {f.title}
                </div>
                <div style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.4, fontFamily: isBengali ? "'Hind Siliguri', sans-serif" : bodyFont }}>
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Recipe 6: Minimal Editorial
    if (recipe.id === 'MINIMAL_EDITORIAL') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '850px' }}>
          <TextMaskReveal
            text={scene.heading}
            delay={4}
            durationInFrames={28}
            direction="bottom-to-top"
            color="#FFFFFF"
            accentColor={accent}
            fontSize={headingSize}
            fontFamily={headingFont}
          />
          {scene.subheading && (
            <div style={{ marginTop: '1.5rem' }}>
              <WordReveal
                text={scene.subheading}
                delay={18}
                staggerDelay={2}
                direction="up"
                color="#64748B"
                highlightColor="#94A3B8"
                fontSize="22px"
                fontWeight={500}
                fontFamily={bodyFont}
              />
            </div>
          )}
        </div>
      );
    }

    // Recipe 9: Split Velocity
    if (recipe.id === 'SPLIT_VELOCITY') {
      const metric = (scene.metrics && scene.metrics[0]) || { label: 'VELOCITY GAIN', targetNumber: 10, suffix: 'x' };

      return (
        <div style={{ display: 'flex', flexDirection: isVertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isVertical ? '2rem' : '4rem', maxWidth: isVertical ? '90%' : '1100px', width: '100%' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <AnimatedCounter
              to={metric.targetNumber || 10}
              suffix={metric.suffix || 'x'}
              label={metric.label}
              color={accent}
              delay={4}
              showRadialGauge={true}
              gaugeRadius={48}
              fontSize="60px"
            />
          </div>
          <div style={{ flex: 1.2, textAlign: isVertical ? 'center' : 'left' }}>
            <WordReveal
              text={scene.heading}
              delay={8}
              textAlign={isVertical ? 'center' : 'left'}
              color="#FFFFFF"
              highlightColor={accent}
              highlightWords={keywords}
              fontSize={isVertical ? '36px' : '52px'}
              fontFamily={headingFont}
            />
            {scene.subheading && (
              <p style={{ marginTop: '1rem', color: '#94A3B8', fontSize: '18px', lineHeight: 1.5, fontFamily: isBengali ? "'Hind Siliguri', sans-serif" : bodyFont }}>
                {scene.subheading}
              </p>
            )}
          </div>
        </div>
      );
    }

    // Recipe 10: Climactic CTA
    if (recipe.id === 'CLIMACTIC_CTA') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: isVertical ? '90%' : '1100px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <IconAnimation icon="rocket" animationType="pulse" color={accent} size={isVertical ? 60 : 76} delay={2} />
          </div>
          <WordReveal
            text={scene.heading}
            delay={5}
            direction="up"
            color="#FFFFFF"
            highlightColor={accent}
            highlightWords={keywords}
            fontSize={headingSize}
            fontFamily={headingFont}
          />
          {scene.subheading && (
            <p style={{ marginTop: '1rem', color: '#A78BFA', fontSize: '22px', maxWidth: '800px', lineHeight: 1.4, fontFamily: isBengali ? "'Hind Siliguri', sans-serif" : bodyFont }}>
              {scene.subheading}
            </p>
          )}
          <div style={{ marginTop: isVertical ? '2rem' : '2.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: isVertical ? '14px 34px' : '18px 46px',
                borderRadius: '9999px',
                background: `linear-gradient(135deg, ${accent} 0%, ${secondary} 100%)`,
                color: '#FFFFFF',
                fontFamily: headingFont,
                fontWeight: 800,
                fontSize: isVertical ? '16px' : '20px',
                letterSpacing: isBengali ? '0' : '0.04em',
                boxShadow: `0 0 35px ${accent}88, 0 8px 24px rgba(0,0,0,0.5)`,
                cursor: 'pointer'
              }}
            >
              <span>{isBengali ? 'এখনই শুরু করুন' : 'START PRODUCING'}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // Default: Kinetic Cascade / Neural Explosion
    return (
      <KineticTypography
        headline={scene.heading}
        subheadline={scene.subheading}
        badge={scene.badge}
        preset={scene.motionPreset || 'energetic'}
        accentColor={accent}
        secondaryColor={secondary}
        highlightWords={keywords}
        fontSize={headingSize}
        fontFamily={headingFont}
        align={scene.layout === 'split-left' ? 'left' : scene.layout === 'split-right' ? 'right' : 'center'}
      />
    );
  };

  // 4. FLOATING ACCENT LAYER (Keyword Tags & Embellishments)
  const renderAccentLayer = () => {
    if (!keywords || keywords.length === 0) return null;

    return (
      <div
        style={{
          position: 'absolute',
          bottom: isVertical ? '30px' : '45px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          pointerEvents: 'none'
        }}
      >
        {keywords.slice(0, 3).map((kw, kwIdx) => (
          <div
            key={kwIdx}
            style={{
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: `1px solid ${accent}44`,
              color: accent,
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              boxShadow: `0 0 15px ${accent}22`
            }}
          >
            #{kw}
          </div>
        ))}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <DynamicTransition
        type={transitionType}
        durationInFrames={transitionDuration}
        sceneDurationInFrames={durationInFrames}
      >
        <ParallaxScene
          backgroundLayer={renderBackgroundLayer()}
          midgroundLayer={renderMidgroundLayer()}
          foregroundLayer={renderForegroundLayer()}
          accentLayer={renderAccentLayer()}
          intensity={0.8}
          direction={recipe.parallax}
        />
      </DynamicTransition>
    </AbsoluteFill>
  );
};

