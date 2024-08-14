import { Message, User } from '~/shared';

export type TMessageProps = {
  sender: User;
  replyMessage: Message;
  forwardedMessage: Message;
  content: string;
  hasAvatar: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
  status: Message['status'];
  isEdited?: boolean;
  readed: string[];
  voiceMessage?: string;
  voiceLoading?: boolean;
  scrollToMessage: (id: string) => void;
};
