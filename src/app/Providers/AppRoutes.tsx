import { Route, Routes, useParams } from 'react-router-dom';

import { Chat, Home, SignIn, SignInApprove, SignUp, SignUpApprove } from '~/pages';
import { useMobileStore } from '~/shared';

import { AuthOutlet } from './AuthOutlet';
import { MainLayout } from './MainLayout';
import { NonAuthOutlet } from './NonAuthOutlet';

const AppRoutes = () => {
  const { type, lastChat } = useMobileStore();

  const dialogId = useParams().dialogId ?? (type !== 'desktop' ? lastChat : '');

  return (
    <Routes>
      <Route element={<AuthOutlet />}>
        <Route element={<MainLayout />}>
          <Route index element={dialogId ? <Chat /> : <Home />} />
          <Route path=':dialogId' element={<Chat />} />
        </Route>
      </Route>
      <Route element={<NonAuthOutlet />}>
        <Route path='sign-in'>
          <Route index element={<SignIn />} />
          <Route path='approve' element={<SignInApprove />} />
        </Route>
        <Route path='sign-up'>
          <Route index element={<SignUp />} />
          <Route path='approve' element={<SignUpApprove />} />
        </Route>
      </Route>
      <Route path='*' element={<h1>404</h1>} />
    </Routes>
  );
};

export { AppRoutes };
