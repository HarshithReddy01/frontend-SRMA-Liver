export const isAuthenticated = (): boolean => {
  const localAuth = localStorage.getItem('isAuthenticated') === 'true';
  return localAuth;
};

import { API_ENDPOINTS } from '../config/api';

export const checkAuthWithBackend = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.CHECK_AUTH, {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking authentication with backend:', error);
    return false;
  }
};

export const getUserData = () => {
  const userDataStr = localStorage.getItem('userData');
  return userDataStr ? JSON.parse(userDataStr) : null;
};

export const getLoginType = (): string | null => {
  return localStorage.getItem('loginType');
};

export const isOAuth2User = (): boolean => {
  return getLoginType() === 'GOOGLE_OAUTH2';
};

export const requireAuth = (navigate: any, redirectTo: string = '/login') => {
  if (!isAuthenticated()) {
    navigate(redirectTo);
    return false;
  }
  return true;
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userData');
  localStorage.removeItem('loginType');
  sessionStorage.clear();
};

export const safeAddEventListener = (
  element: Element | null,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): void => {
  if (element) {
    element.addEventListener(event, handler, options);
  } else {
    console.warn(`Element not found for event listener: ${event}`);
  }
};

export const safeRemoveEventListener = (
  element: Element | null,
  event: string,
  handler: EventListener,
  options?: boolean | EventListenerOptions
): void => {
  if (element) {
    element.removeEventListener(event, handler, options);
  }
};

export const safeGetElementById = (id: string): HTMLElement | null => {
  try {
    return document.getElementById(id);
  } catch (error) {
    console.warn(`Error getting element by ID ${id}:`, error);
    return null;
  }
};

export const safeQuerySelector = (selector: string): Element | null => {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Error getting element by selector ${selector}:`, error);
    return null;
  }
};

export const waitForDOMContentLoaded = (callback: () => void): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

export const safeAddEventListenerAfterLoad = (
  selector: string,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): void => {
  waitForDOMContentLoaded(() => {
    const element = safeQuerySelector(selector);
    safeAddEventListener(element, event, handler, options);
  });
}; 