import { UserRegister, UserResponse } from '../models/User';
import api from './api.service';

const ENDPOINTS = {
    BASE: '/users',
    USER_BY_ID: (id: number) => `/users/${id}`
};

/**
 * Servicio para gestionar las operaciones relacionadas con usuarios
 */
const userService = {
    /**
     * Registra un nuevo usuario
     * @param userData Datos del usuario a registrar
     * @returns Los datos del usuario creado
     */
    register: async (userData: UserRegister): Promise<UserResponse> => {
        try {
            const response = await api.post<UserResponse>(ENDPOINTS.BASE, userData);
            return response.data;
        } catch (error: any) {
            // Propagar el error completo para poder acceder a error.response.data.code
            throw error;
        }
    },

    /**
     * Obtiene todos los usuarios (solo admin)
     * @returns Lista de todos los usuarios
     */
    getAll: async (): Promise<UserResponse[]> => {
        try {
            const response = await api.get<UserResponse[]>(ENDPOINTS.BASE);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al obtener los usuarios');
        }
    },

    /**
     * Obtiene un usuario por su ID
     * @param id ID del usuario
     * @returns Datos del usuario
     */
    getById: async (id: number): Promise<UserResponse> => {
        try {
            const response = await api.get<UserResponse>(ENDPOINTS.USER_BY_ID(id));
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Error al obtener el usuario con ID ${id}`);
        }
    },

    /**
     * Actualiza los datos de un usuario
     * @param id ID del usuario
     * @param userData Datos actualizados del usuario
     * @returns Datos del usuario actualizado
     */
    update: async (id: number, userData: Partial<UserRegister>): Promise<UserResponse> => {
        try {
            const response = await api.put<UserResponse>(
                ENDPOINTS.USER_BY_ID(id), 
                { id, ...userData }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Error al actualizar el usuario con ID ${id}`);
        }
    },

    /**
     * Elimina un usuario (solo admin)
     * @param id ID del usuario a eliminar
     * @returns true si se eliminó correctamente
     */
    delete: async (id: number): Promise<boolean> => {
        try {
            await api.delete(ENDPOINTS.USER_BY_ID(id));
            return true;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Error al eliminar el usuario con ID ${id}`);
        }
    }
};

export default userService; 