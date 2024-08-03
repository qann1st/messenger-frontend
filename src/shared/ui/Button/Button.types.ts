import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export type TButtonProps = { isLoading?: boolean; children: ReactNode } & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
