import axios from 'axios';
import storageService from './storage.service';

// Obtener la URL base de la API del entorno o usar un valor por defecto
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Instancia configurada de Axios para todas las peticiones API
 * Con interceptores para manejo de tokens y errores de autenticación
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para agregar el token a todas las solicitudes
api.interceptors.request.use((config) => {
    // Si se están usando cookies HttpOnly, no es necesario agregar el token
    // manualmente, pero lo mantenemos por compatibilidad hasta que
    // el backend esté completamente configurado
    const token = storageService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Si recibimos un error 401 (no autorizado), limpiar la sesión
        // if (error.response?.status === 401) {
        //     // Token inválido o expirado
        //     await storageService.removeToken();
            
        //     // Redirigir al login
        //     window.location.href = '/login';
        // }
        return Promise.reject(error);
    }
);

export default api; 