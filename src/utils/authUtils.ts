
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