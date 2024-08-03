import type { IconType } from 'react-icons';

import type { Message } from '~/shared';

export type TMessagePreviewProps = {
  type: 'input' | 'message';
  icon?: IconType;
  message?: Message;
  isColor?: boolean;
  isVisible?: boolean;
  className?: string;
  setIsVisible?: (value: boolean) => void;
  onClose?: () => void;
};
