export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getUserData = () => {
  const userDataStr = localStorage.getItem('userData');
  return userDataStr ? JSON.parse(userDataStr) : null;
};

export const requireAuth = (navigate: any, redirectTo: string = '/login') => {
  if (!isAuthenticated()) {
    navigate(redirectTo);
    return false;
  }
  return true;
}; 