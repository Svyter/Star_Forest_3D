import React from 'react';
import { Composition } from 'remotion';
import { StarForestComposition } from './StarForestComposition';
import { FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT } from './data/timeline';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="StarForest"
        component={StarForestComposition}
        durationInFrames={DURATION_IN_FRAMES} // 300
        fps={FPS} // 30
        width={WIDTH} // 1920
        height={HEIGHT} // 1080
        defaultProps={{}}
      />
    </>
  );
};
