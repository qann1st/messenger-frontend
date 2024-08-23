import { lazy } from 'react';

export const SignUpApprove = lazy(() =>
  import('./SignUpApprove').then(({ SignUpApprove }) => ({ default: SignUpApprove })),
);
