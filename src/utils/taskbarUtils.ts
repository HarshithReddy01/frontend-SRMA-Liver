export const detectTaskbarHeight = (): number => {
  const isWindows = navigator.platform.toLowerCase().includes('win');
  
  if (!isWindows) {
    return 0;
  }

  const viewportHeight = window.innerHeight;
  const screenHeight = window.screen.height;
  
  const potentialTaskbarHeight = screenHeight - viewportHeight;
  
  return Math.min(Math.max(potentialTaskbarHeight, 0), 60);
};

export const updateSafeBottomSpacing = (): void => {
  const taskbarHeight = detectTaskbarHeight();
  const safeBottom = Math.max(20, taskbarHeight + 10);
  
  document.documentElement.style.setProperty('--safe-bottom', `${safeBottom}px`);
  document.documentElement.style.setProperty('--taskbar-height', `${taskbarHeight}px`);
};

export const initializeTaskbarDetection = (): void => {
  updateSafeBottomSpacing();
  
  window.addEventListener('resize', updateSafeBottomSpacing);
  
  window.addEventListener('orientationchange', () => {
    setTimeout(updateSafeBottomSpacing, 100);
  });
};

export const cleanupTaskbarDetection = (): void => {
  window.removeEventListener('resize', updateSafeBottomSpacing);
  window.removeEventListener('orientationchange', updateSafeBottomSpacing);
};
