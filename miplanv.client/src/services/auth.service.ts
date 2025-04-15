import { AuthUser, GoogleLoginRequest } from '../models/User';
import api from './api.service';
import storageService from './storage.service';

const ENDPOINTS = {
    LOGIN: '/auth/login',
    GOOGLE_LOGIN: '/auth/google',
    LOGOUT: '/auth/logout'
}

/**
 * Revoca un token de acceso de Google
 * @param accessToken Token de acceso de Google a revocar
 */
const revokeGoogleToken = async (accessToken: string): Promise<void> => {
    try {
        const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;
        // Usamos una petición directa sin la configuración base porque es una URL externa
        await api.post(revokeUrl, null, {
            baseURL: '', // Anular la baseURL para usar la URL completa
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error) {
        console.error('Error al revocar el token de Google', error);
    }
};

const authService = {
    login: async (email: string, password: string): Promise<AuthUser> => {
        try {
            const response = await api.post<AuthUser>(ENDPOINTS.LOGIN, { email, password });
            
            // Almacenar el token de forma segura
            if (response.data && response.data.token) {
                await storageService.setToken(response.data.token);
            }
            
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al iniciar sesión: ' + (error.message || 'Error en la conexión al servidor'));
        }
    },

    googleLogin: async (googleData: any): Promise<AuthUser> => {
        try {
            const googleLoginRequest: GoogleLoginRequest = {
                email: googleData.email,
                name: googleData.name,
                googleId: googleData.sub,
                imageUrl: googleData.picture,
                phoneNumber: googleData.phoneNumber || ''
            };

            const response = await api.post<AuthUser>(ENDPOINTS.GOOGLE_LOGIN, googleLoginRequest);
            
            // Almacenar el token de forma segura
            if (response.data && response.data.token) {
                await storageService.setToken(response.data.token);
                
                // Almacenar el token de Google para poder revocarlo más tarde
                sessionStorage.setItem('google_access_token', googleData.access_token || '');
            }
            
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al iniciar sesión con Google: ' + (error.message || 'Error en la conexión al servidor'));
        }
    },

    logout: async (): Promise<void> => {
        // 1. Intentar revocar el token en el servidor
        try {
            await api.post(ENDPOINTS.LOGOUT);
        } catch (error) {
            console.warn('Error al revocar el token en el servidor', error);
        }
        
        // 2. Revocar el token de Google si existe
        const googleToken = sessionStorage.getItem('google_access_token');
        if (googleToken) {
            await revokeGoogleToken(googleToken);
            sessionStorage.removeItem('google_access_token');
        }
        
        // 3. Eliminar el token local
        await storageService.removeToken();
        
        // 4. Limpiar cualquier otra información de sesión
        sessionStorage.clear();
    },

    isAuthenticated: (): boolean => {
        return storageService.isAuthenticated();
    },

    getToken: (): string | null => {
        return storageService.getToken();
    }
};

export default authService; 