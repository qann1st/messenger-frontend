import { memo, type FC, type PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '~/shared';

const Providers: FC<PropsWithChildren> = memo(({ children }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </BrowserRouter>
));

export { Providers };

