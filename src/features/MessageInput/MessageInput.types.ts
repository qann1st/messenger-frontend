import { RefObject } from 'react';

export type TMessageInputProps = {
  recipient: string;
  inputValue: string;
  dialogId?: string;
  file?: string;
  type?: 'absolute' | 'not-absolute';
  haveButtons?: boolean;
  isDisabled?: boolean;
  scrollRef?: RefObject<HTMLDivElement>;
  setInputValue: (value: string) => void;
  addInputValue: (value: string) => void;
};
