import apiClient from './api-client';
import { useAuthStore } from '@/stores/auth-store';
import { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    // Backend expects OAuth2PasswordRequestForm (form-data) for login
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ user_id: string; email: string; message: string }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  },

  logout: () => {
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};
