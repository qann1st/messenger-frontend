import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';

export type TInputProps = {
  leftIcon?: ReactNode;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
