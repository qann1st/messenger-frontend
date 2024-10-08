import { RefObject } from 'react';
import { IconType } from 'react-icons';

export type TDropdownProps = {
  isToggled: boolean;
  className?: string;
  buttons: {
    icon: IconType;
    text: string;
    isDelete?: boolean;
    show?: boolean;
    onClick?: (ref?: RefObject<HTMLButtonElement>) => void;
    checkbox?: boolean;
    isActive?: boolean;
  }[];
  setIsVisible?: (value: boolean) => void;
};
