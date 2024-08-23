import { lazy } from 'react';

export const SignInApprove = lazy(() =>
  import('./SignInApprove').then(({ SignInApprove }) => ({ default: SignInApprove })),
);
