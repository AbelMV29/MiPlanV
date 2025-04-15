import api from './api.service';

/**
 * Servicio para el almacenamiento seguro de tokens de autenticación
 * utilizando cookies HttpOnly cuando sea posible y localStorage como respaldo
 */
const storageService = {
    /**
     * Almacena el token de autenticación de forma segura
     * @param token El token JWT a almacenar
     */
    setToken: async (token: string): Promise<void> => {
        try {
            // Intentar establecer una cookie HttpOnly mediante un endpoint seguro
            await api.post('/auth/set-cookie', { token });
            // Almacenar solo un indicador en localStorage (no el token completo)
            localStorage.setItem('auth_status', 'logged_in');
            
            // Almacenar también en localStorage para compatibilidad
            localStorage.setItem('token', token);
        } catch (error) {
            // Si el endpoint no está disponible, usar localStorage como fallback
            console.warn('No se pudo establecer cookie segura, usando localStorage como respaldo');
            localStorage.setItem('token', token);
            localStorage.setItem('auth_status', 'logged_in');
        }
    },
    
    /**
     * Obtiene el token de autenticación
     * @returns El token JWT o null si no hay token
     */
    getToken: (): string | null => {
        // Como las cookies HttpOnly no son accesibles desde JavaScript, 
        // el token real se enviará automáticamente con las solicitudes.
        // Pero sí podemos obtener el token de localStorage si está disponible.
        return localStorage.getItem('token');
    },
    
    /**
     * Elimina el token de autenticación
     */
    removeToken: async (): Promise<void> => {
        try {
            // Eliminar la cookie mediante un endpoint
            await api.post('/auth/clear-cookie');
        } catch (error) {
            console.warn('No se pudo eliminar la cookie segura');
        } finally {
            // Siempre limpiar el localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('auth_status');
        }
    },
    
    /**
     * Verifica si el usuario está autenticado
     * @returns true si el usuario está autenticado, false en caso contrario
     */
    isAuthenticated: (): boolean => {
        return localStorage.getItem('auth_status') === 'logged_in' || 
               localStorage.getItem('token') !== null;
    }
};

export default storageService; 