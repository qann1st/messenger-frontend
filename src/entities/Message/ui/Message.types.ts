import { Message, User } from '~/shared';

export type TMessageProps = {
  sender: User;
  replyMessage: Message;
  content: string;
  hasAvatar: boolean;
  isEdited?: boolean;
  createdAt: string;
  updatedAt: string;
};
