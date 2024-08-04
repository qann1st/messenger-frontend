import { useParams } from 'react-router-dom';

import { UserBadge } from '~/entities';
import { useSearchStore } from '~/shared';
import { Skeleton } from '~/shared/ui/Skeleton';

import styles from './SearchDialogsList.module.css';

const SearchDialogsList = () => {
  const { dialogId } = useParams();

  const { searchDialogs, fetching } = useSearchStore();

  if (fetching) {
    return (
      <div className={styles.dialogs}>
        {new Array(10).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton.Rectangle key={i} className={styles.skeleton} width='100%' height='75px' />
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
          userId={dialog.id}
          isSearch
        />
      ))}
      {!searchDialogs.length && <p className={styles.not_found}>Ничего не найдено</p>}
    </div>
  );
};

export { SearchDialogsList };
