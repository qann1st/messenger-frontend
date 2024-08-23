import { FC, FormEvent } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';

import { Avatar, Input, SidebarLayout, classNames, useForm, usePopStateCloseModal, useUserStore } from '~/shared';

import styles from './EditProfile.module.css';

import { TEditProfileProps } from './EditProfile.types';

const EditProfile: FC<TEditProfileProps> = ({ isOpened, onClose, setIsVisible }) => {
  const { user, socket, setUser } = useUserStore();

  const { values, onChange, isValid, errors } = useForm({ firstname: user?.firstname, lastname: user?.lastname });

  usePopStateCloseModal(onClose);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid && socket) {
      socket.emit('update-user', values);

      if (user && values.firstname && values.lastname) {
        setUser({ ...user, firstname: values.firstname.trim(), lastname: values.lastname.trim() });
        onClose();
      }
    }
  };

  return (
    <SidebarLayout isOpened={isOpened} onClose={onClose} title='Edit profile' setIsVisible={setIsVisible}>
      <div className={styles.edit_profile}>
        <Avatar size='large' firstName={values.firstname} lastName={values.lastname} />
      </div>
      <form className={styles.edit_form} onSubmit={handleSubmit}>
        <div className={styles.edit_form_item}>
          <label htmlFor='firstname'>First Name</label>
          <Input error={errors.firstname} required name='firstname' value={values.firstname} onChange={onChange} />
        </div>
        <div className={styles.edit_form_item}>
          <label htmlFor='lastname'>Last name</label>
          <Input error={errors.lastname} name='lastname' value={values.lastname} onChange={onChange} />
        </div>
        <button
          className={classNames(
            styles.submit,
            isValid &&
              (values.firstname !== user?.firstname || values.lastname !== user?.lastname) &&
              styles.submit_visible,
          )}
          type='submit'
        >
          <IoCheckmarkSharp size={24} />
        </button>
      </form>
    </SidebarLayout>
  );
};

export { EditProfile };
