import React from 'react';
import { Composition } from 'remotion';
import { MotionReel } from './MotionReel';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MotionReel"
        component={MotionReel}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          project: null
        }}
      />
    </>
  );
};

