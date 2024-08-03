import type { User } from '~/shared';

export type TSearchState = {
  searchDialogs: User[];
  isSearch: boolean;
  fetching: boolean;
  inputValue: string;
  fetchUsers: (search: string) => void;
  clearDialogs: () => void;
  setIsSearch: (isSearch: boolean) => void;
  setInputValue: (inputValue: string) => void;
};
