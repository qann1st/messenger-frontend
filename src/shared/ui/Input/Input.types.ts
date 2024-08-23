import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';

export type TInputProps = {
  leftIcon?: ReactNode;
  error?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
