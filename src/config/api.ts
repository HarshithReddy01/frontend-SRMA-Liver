export const API_BASE_URL = 'https://ai.paninsight.org';

export const API_ENDPOINTS = {
  CHATBOT_ASK: `${API_BASE_URL}/api/ask`,
  CHATBOT_HEALTH: `${API_BASE_URL}/api/chat/health`,
};

const DEEPINFRA_API_KEY = import.meta.env.VITE_DEEPINFRA_API_KEY || 'mVF4JYfmpeE8ywod0P1cGzalCQNjG1kQ';

export const getDeepInfraApiKey = (): string => {
  return DEEPINFRA_API_KEY;
};
