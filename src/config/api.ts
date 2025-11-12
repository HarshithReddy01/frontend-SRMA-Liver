export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai.paninsight.org';

export const API_ENDPOINTS = {
  CHATBOT_ASK: `${API_BASE_URL}/api/ask`,
  CHATBOT_HEALTH: `${API_BASE_URL}/api/chat/health`,
  SEGMENT: `${API_BASE_URL}/api/segment`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

const DEEPINFRA_API_KEY = import.meta.env.VITE_DEEPINFRA_API_KEY || 'mVF4JYfmpeE8ywod0P1cGzalCQNjG1kQ';

export const getDeepInfraApiKey = (): string => {
  return DEEPINFRA_API_KEY;
};

export interface SegmentationResponse {
  success: boolean;
  overlay_image?: string;
  segmentation_path?: string;
  mask_path_token?: string;
  mask_download_url?: string;
  segmentation_file?: string;
  statistics?: {
    volume_shape: number[];
    liver_voxels: number;
    total_voxels: number;
    liver_percentage: number;
    slice_index: number;
    total_slices: number;
    modality: string;
    liver_volume_ml: number;
  };
  medical_report?: any;
  error?: string;
  error_type?: string;
}
