import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicChatbot from './PublicChatbot';

const AppLayout: React.FC = () => {
  const location = useLocation();
  
  // Don't show chatbot on login, register, or other auth pages
  const isAuthPage = location.pathname === '/login' || 
                    location.pathname === '/register' || 
                    location.pathname === '/verify-email' ||
                    location.pathname === '/forgot-password' ||
                    location.pathname === '/reset-password' ||
                    location.pathname === '/otp-verification' ||
                    location.pathname === '/otp-verification-reset';

  return (
    <>
      <Outlet />
      {!isAuthPage && <PublicChatbot />}
    </>
  );
};

export default AppLayout;
