import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicChatbot from './PublicChatbot';

const AppLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <PublicChatbot />
    </>
  );
};

export default AppLayout;
