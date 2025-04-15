import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import storageService from '../services/storage.service';

interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setUserRole: (role: string) => void;
    initFromToken: () => Promise<void>;
}

// Función para decodificar el token JWT
const decodeToken = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

// Crear el store con persistencia
const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user, token) => {
                // Guardar en localStorage y almacenamiento seguro
                storageService.setToken(token);
                set({ user, token, isAuthenticated: true });
            },
            logout: async () => {
                // Eliminar de localStorage y almacenamiento seguro
                await storageService.removeToken();
                set({ user: null, token: null, isAuthenticated: false });
            },
            setUserRole: (role) => {
                set((state) => ({
                    user: state.user ? { ...state.user, role } : null
                }));
            },
            initFromToken: async () => {
                // Verificar primero si ya estamos autenticados en el estado
                const state = get();
                if (state.isAuthenticated && state.user && state.token) {
                    return;
                }

                // Verificar el localStorage
                const token = localStorage.getItem('token');
                const authStatus = localStorage.getItem('auth_status');
                
                if ((token || authStatus === 'logged_in') && !state.isAuthenticated) {
                    try {
                        // Si tenemos el token, decodificarlo directamente
                        if (token) {
                            const decoded = decodeToken(token);
                            if (decoded) {
                                const user: User = {
                                    id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
                                    name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
                                    email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email || '',
                                    role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
                                };
                                set({ user, token, isAuthenticated: true });
                                return;
                            }
                        } 
                        // Si solo tenemos el indicador pero no el token (caso de cookie HttpOnly)
                        else if (authStatus === 'logged_in') {
                            // Intentar obtener información del usuario mediante una petición API
                            // Para simplificar, aquí solo establecemos que está autenticado
                            // pero sin detalles del usuario hasta que se realice una petición al backend
                            set({ isAuthenticated: true });
                            return;
                        }
                    } catch (error) {
                        console.error('Error al inicializar autenticación:', error);
                    }
                }
                
                // Si llegamos aquí, es que no hay autenticación
                set({ user: null, token: null, isAuthenticated: false });
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated 
            })
        }
    )
);

export default useAuthStore; 