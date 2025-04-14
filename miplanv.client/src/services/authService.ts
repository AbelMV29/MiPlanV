import { UserRegister, UserResponse } from '../models/User';
import { api } from './api';

export const authService = {
    register: async (userData: UserRegister): Promise<UserResponse> => {
        try {
            const response = await api.post<UserResponse>('/users/register', userData);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Error al registrar el usuario');
        }
    }
}; 