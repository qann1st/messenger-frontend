import type { Message } from '~/shared';

export const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce((groups: { [key: string]: Message[] }, message: Message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
};
