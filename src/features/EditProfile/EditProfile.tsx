import { FC } from 'react';

import { SidebarLayout } from '~/shared/ui/SidebarLayout';

import { TEditProfileProps } from './EditProfile.types';

const EditProfile: FC<TEditProfileProps> = ({ isOpened, onClose, setIsVisible }) => {
  return (
    <SidebarLayout isOpened={isOpened} onClose={onClose} title='Edit profile' setIsVisible={setIsVisible} key='ffsdf'>
      d
    </SidebarLayout>
  );
};

export { EditProfile };
