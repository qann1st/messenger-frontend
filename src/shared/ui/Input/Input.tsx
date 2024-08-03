import { FC, memo } from 'react';

import { TInputProps, classNames } from '~/shared';

import styles from './Input.module.css';

const Input: FC<TInputProps> = memo(({ leftIcon, ...rest }) => {
  return (
    <div className={styles.root}>
      <input {...rest} className={classNames(styles.input, leftIcon && styles.input_with_icon, rest.className)} />
      <span className={styles.icon}>{leftIcon}</span>
    </div>
  );
});

export { Input };
