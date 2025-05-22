import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('API URL not found in environment variables');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based auth
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only remove user data on unauthorized response
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface Profile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at?: string;
}

export interface LoginResponse {
  user: Profile;
}

export interface PredictionHistory {
  id: string;
  user_id: string;
  symptoms: string[];
  predicted_disease: string;
  description: string;
  medications: string[];
  diet: string[];
  workout: string[];
  precautions: string[];
  created_at: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data.user;
      if (!userData || !userData.id || !userData.email) {
        throw new Error('Invalid user data received');
      }
      localStorage.setItem('user', JSON.stringify(userData));
      return { user: userData };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  },

  register: async (email: string, password: string, username: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/register', { email, password, username });
      const userData = response.data.user;
      if (!userData || !userData.id || !userData.email) {
        throw new Error('Invalid user data received');
      }
      localStorage.setItem('user', JSON.stringify(userData));
      return { user: userData };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('user');
    }
  },

  updateProfile: async (userData: Partial<Profile>): Promise<Profile> => {
    const response = await api.put('/profile/update', userData);
    return response.data.user;
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProfile: async (): Promise<Profile> => {
    try {
      const response = await api.get('/profile');
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch profile data';
      throw new Error(message);
    }
  },
};

export const predictionApi = {
  predict: async (symptoms: string[]) => {
    try {
      const response = await api.post('/predict', { symptoms });
      return response.data;
    } catch (error: any) {
      const message = error.response?.status === 400
        ? 'Please select valid symptoms for prediction'
        : error.response?.data?.message || 'Prediction failed. Please try again.';
      throw new Error(message);
    }
  },

  getPredictionHistory: async (): Promise<PredictionHistory[]> => {
    const response = await api.get('/prediction-history');
    return response.data;
  },
};
