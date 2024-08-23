import { FC, memo } from 'react';

import { TInputProps, classNames } from '~/shared';

import styles from './Input.module.css';

const Input: FC<TInputProps> = memo(({ leftIcon, error, ...rest }) => {
  return (
    <div className={styles.root}>
      <input
        {...rest}
        style={{ height: rest.height }}
        className={classNames(
          styles.input,
          leftIcon && styles.input_with_icon,
          rest.className,
          error && styles.input_error,
        )}
      />
      <span className={styles.icon} style={{ top: `${(Number(rest.height) ?? 52) / 2 - 12}px` }}>
        {leftIcon}
      </span>
    </div>
  );
});

export { Input };
