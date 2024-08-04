import { type ChangeEvent, type FC, type FormEvent, memo } from 'react';
import { FaSearch } from 'react-icons/fa';

import { useMessageStore } from '~/entities';
import { Input, useSearchStore } from '~/shared';

import type { TSearchInputProps } from './SearchInput.types';

const SearchInput: FC<TSearchInputProps> = memo(({ className }) => {
  const { fetchUsers, clearDialogs, setIsSearch, inputValue, setInputValue } = useSearchStore();
  const { setOtherInputFocus } = useMessageStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.length) {
      await fetchUsers(inputValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!e.target.value.length) {
      clearDialogs();
      setIsSearch(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Input
        onFocus={() => setOtherInputFocus(true)}
        onBlur={() => setOtherInputFocus(false)}
        minLength={1}
        value={inputValue}
        onChange={handleChange}
        leftIcon={<FaSearch />}
        placeholder='Search'
      />
    </form>
  );
});

export { SearchInput };
