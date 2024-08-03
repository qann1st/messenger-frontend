import { AxiosError } from 'axios';
import { type FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Auth, Button, Input, messengerApi, useForm } from '~/shared';

const SignUp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { values, onChange, isValid } = useForm({ username: '', lastname: '', firstname: '' });

  useEffect(() => {
    if (!state.email) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await messengerApi.signUp({ email: state.email, ...values });

      if (data.success) {
        navigate('/sign-up/approve', { state: { email: state.email } });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Auth onSubmit={handleSubmit} title='Sign Up' hasBackPage>
      <Input
        name='firstname'
        onChange={onChange}
        value={values.firstname}
        placeholder='First Name'
        minLength={1}
        maxLength={16}
        required
      />
      <Input
        name='lastname'
        onChange={onChange}
        value={values.lastname}
        placeholder='Last Name'
        minLength={1}
        maxLength={16}
      />
      <Input
        name='username'
        onChange={onChange}
        value={values.username}
        placeholder='User Name'
        minLength={1}
        maxLength={16}
      />
      <Button isLoading={isLoading} disabled={!isValid || !values.username || !values.firstname || !values.lastname}>
        Continue
      </Button>
    </Auth>
  );
};

export { SignUp };
