import { lazy } from 'react';

export const Waveform = lazy(() => import('./WaveForm').then(({ Waveform }) => ({ default: Waveform })));
