export type TMessageInputProps = {
  recipient: string;
  inputValue: string;
  dialogId?: string;
  file?: string;
  type?: 'absolute' | 'not-absolute';
  haveButtons?: boolean;
  isDisabled?: boolean;
  setInputValue: (value: string) => void;
  addInputValue: (value: string) => void;
};
