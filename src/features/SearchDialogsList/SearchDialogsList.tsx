import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { UserBadge } from '~/entities';
import { Skeleton, useSearchStore } from '~/shared';

import styles from './SearchDialogsList.module.css';

const SearchDialogsList = () => {
  const { dialogId } = useParams();

  const [searchDialogs, fetching] = useSearchStore(useShallow((state) => [state.searchDialogs, state.fetching]));

  if (fetching) {
    return (
      <div className={styles.dialogs}>
        {new Array(30).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton.Rectangle key={i} borderRadius='16px' width='100%' height='75px' />
        ))}
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
          unreadedMessages={0}
          userId={dialog.id}
          isSearch
        />
      ))}
      {!searchDialogs.length && <p className={styles.not_found}>Not found</p>}
    </div>
  );
};

export { SearchDialogsList };
