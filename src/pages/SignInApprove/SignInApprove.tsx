import { AxiosError } from 'axios';
import type { ChangeEvent, FC, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Input, messengerApi, useForm, useUserStore } from '~/shared';
import { Auth } from '~/shared';

const SignInApprove: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const { fetchUser } = useUserStore();

  const { state } = useLocation();
  const navigate = useNavigate();

  const { values, onChange } = useForm({ approveCode: '' });

  useEffect(() => {
    if (values.approveCode.length === 6) {
      handleSubmit();
    }
  }, [values.approveCode]);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);

    try {
      await messengerApi.signInApproved({ ...values, email: state.email });
      await fetchUser();

      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data.message === 'Wrong code') {
          setError('Wrong code');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(Number(e.target.value))) {
      onChange(e);
    }
  };

  if (!state) {
    return <Navigate to='/' />;
  }

  return (
    <Auth
      error={error}
      onSubmit={handleSubmit}
      title='Confirm your E-mail'
      subtitle='Code have been sent to your e-mail'
      ref={formRef}
      hasBackPage
    >
      <Input
        type='text'
        name='code'
        onChange={handleChange}
        value={values.approveCode}
        placeholder='Approve code'
        minLength={6}
        maxLength={6}
        disabled={isLoading}
      />
    </Auth>
  );
};

export { SignInApprove };
