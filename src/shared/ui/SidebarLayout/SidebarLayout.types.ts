import { ReactNode } from 'react';

export type TSidebarLayoutProps = {
  onClose: () => void;
  setIsVisible: (value: boolean) => void;
  right?: ReactNode;
  children: ReactNode;
  isOpened: boolean;
  title: string;
  isSlide?: boolean;
};
