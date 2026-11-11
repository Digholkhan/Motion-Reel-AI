import React from 'react';
import { ZoomTransition } from './ZoomTransition';
import { BlurTransition } from './BlurTransition';
import { SlideTransition } from './SlideTransition';
import { GlitchTransition } from './GlitchTransition';

export const DynamicTransition = ({
  children,
  type = 'zoom',
  durationInFrames = 15,
  sceneDurationInFrames = 150
}) => {
  switch (type) {
    case 'blur':
      return (
        <BlurTransition
          durationInFrames={durationInFrames}
          sceneDurationInFrames={sceneDurationInFrames}
        >
          {children}
        </BlurTransition>
      );
    case 'slide':
      return (
        <SlideTransition
          durationInFrames={durationInFrames}
          sceneDurationInFrames={sceneDurationInFrames}
          direction="left"
        >
          {children}
        </SlideTransition>
      );
    case 'glitch':
      return (
        <GlitchTransition
          durationInFrames={durationInFrames}
          sceneDurationInFrames={sceneDurationInFrames}
        >
          {children}
        </GlitchTransition>
      );
    case 'zoom':
    default:
      return (
        <ZoomTransition
          durationInFrames={durationInFrames}
          sceneDurationInFrames={sceneDurationInFrames}
        >
          {children}
        </ZoomTransition>
      );
  }
};

