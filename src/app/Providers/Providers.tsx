import { type FC, type PropsWithChildren, memo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '~/shared';

import { ErrorBoundary } from './ErrorBoundary';

const Providers: FC<PropsWithChildren> = memo(({ children }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </QueryClientProvider>
  </BrowserRouter>
));

export { Providers };
