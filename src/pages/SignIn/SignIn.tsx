import { AxiosError } from 'axios';
import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Auth, Button, Input, messengerApi, useForm } from '~/shared';

const SignIn: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { values, onChange, isValid } = useForm({ email: '' });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await messengerApi.getUserExists(values.email);

      if (data.exists) {
        await messengerApi.signIn({ email: values.email });

        navigate('/sign-in/approve', { state: { email: values.email } });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data.message === 'User not found') {
          navigate('/sign-up', { state: { email: values.email } });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Auth onSubmit={handleSubmit} title='Enter your e-mail'>
      <Input type='email' name='email' onChange={onChange} value={values.email} placeholder='E-mail' />
      <Button isLoading={isLoading} disabled={!isValid || values.email === ''} type='submit'>
        Continue
      </Button>
    </Auth>
  );
};

export { SignIn };
