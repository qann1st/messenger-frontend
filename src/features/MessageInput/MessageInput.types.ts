export type TMessageInputProps = {
  recipient: string;
  inputValue: string;
  dialogId?: string;
  file?: string;
  type?: 'absolute' | 'not-absolute';
  isVoice?: boolean;
  haveButtons?: boolean;
  isDisabled?: boolean;
  onStopRecording?: () => void;
  onCancelRecording?: () => void;
  setInputValue: (value: string) => void;
};
