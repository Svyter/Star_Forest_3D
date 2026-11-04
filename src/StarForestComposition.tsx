import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene } from './components/Scene';

export const StarForestComposition = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#040a1c' }}>
      <Scene />
    </AbsoluteFill>
  );
};
