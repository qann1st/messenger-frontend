import { type FC, memo } from 'react';

import { classNames } from '~/shared';

import styles from './Button.module.css';

import { TButtonProps } from './Button.types';

const Button: FC<TButtonProps> = memo(({ children, isLoading = false, ...rest }) => {
  return (
    <button className={classNames(styles.root, rest.className)} {...rest}>
      {isLoading ? <span className={styles.loader}></span> : children}
    </button>
  );
});

export { Button };
