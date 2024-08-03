import { forwardRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import styles from './Auth.module.css';

import type { TAuthProps } from './Auth.types';

const Auth = forwardRef<HTMLFormElement, TAuthProps>(
  ({ onSubmit, children, title, subtitle, error, hasBackPage }, ref) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (hasBackPage && !state.email) {
        navigate('/');
      }
    }, []);

    return (
      <div className={styles.root}>
        <form ref={ref} className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.form_info}>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          {hasBackPage && (
            <>
              <p className={styles.error}>{error}</p>
              <p className={styles.text}>Your email address: {state.email}</p>
              <Link to='/' className={styles.text}>
                Back to previous page
              </Link>
            </>
          )}
        </form>
      </div>
    );
  },
);

export { Auth };
