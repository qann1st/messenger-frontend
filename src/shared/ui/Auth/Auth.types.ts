import type { FormEventHandler, ReactNode } from 'react';

export type TAuthProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  title: string;
  subtitle?: string;
  error?: string;
  hasBackPage?: boolean;
};
