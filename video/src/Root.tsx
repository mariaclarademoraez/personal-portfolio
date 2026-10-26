import React from 'react';
import { Composition } from 'remotion';
import { GaFlyover, TOTAL } from './GaFlyover';
export const Root: React.FC = () => (
  <Composition id="GaFlyover" component={GaFlyover} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
