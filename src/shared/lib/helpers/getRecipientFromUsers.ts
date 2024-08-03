import { User } from '~/shared';

export const getRecipientFromUsers = (users: User[], myId: string) => users.find((user) => user.id !== myId);
