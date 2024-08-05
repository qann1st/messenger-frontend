export type TMessageInputProps = {
  recipient: string;
  inputValue: string;
  dialogId?: string;
  file?: string;
  type?: 'absolute' | 'not-absolute';
  setInputValue: (value: string) => void;
};
