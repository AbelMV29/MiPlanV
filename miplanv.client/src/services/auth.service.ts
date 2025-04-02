import api from './api.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<void> => {
        await api.post('/auth/register', data);
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
}; 