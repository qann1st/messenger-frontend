import { Message, User } from '~/shared';

export type TMessageProps = {
  sender: User;
  replyMessage: Message;
  content: string;
  hasAvatar: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
  status: Message['status'];
  isEdited?: boolean;
};
