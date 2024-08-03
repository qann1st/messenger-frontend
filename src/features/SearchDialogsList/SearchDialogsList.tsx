import { useParams } from 'react-router-dom';

import { UserBadge } from '~/entities';
import { useSearchStore } from '~/shared';

import styles from './SearchDialogsList.module.css';

const SearchDialogsList = () => {
  const { dialogId } = useParams();

  const { searchDialogs, fetching } = useSearchStore();

  if (fetching) {
    return (
      <div className='wrapper'>
        <div className='loader' />
      </div>
    );
  }

  return (
    <div className={styles.dialogs}>
      {searchDialogs.map((dialog) => (
        <UserBadge
          key={dialog.id}
          isActive={dialog.id === dialogId}
          firstName={dialog.firstname}
          lastName={dialog.lastname}
          lastMessage={`@${dialog.username}`}
          userId={dialog.id}
          isSearch
        />
      ))}
      {!searchDialogs.length && <p className={styles.not_found}>Ничего не найдено</p>}
    </div>
  );
};

export { SearchDialogsList };
