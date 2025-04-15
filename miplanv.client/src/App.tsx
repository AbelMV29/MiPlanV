import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './styles/global.css';
import useAuthStore from './store/useAuthStore';
import { CircularProgress, Box } from '@mui/material';

const App: React.FC = () => {
    const { initFromToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar el estado de autenticación al cargar la aplicación
    useEffect(() => {
        const init = async () => {
            try {
                await initFromToken();
            } catch (error) {
                console.error('Error al inicializar la autenticación:', error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [initFromToken]);

    // Mostrar un indicador de carga mientras se inicializa la autenticación
    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100vh' 
                }}
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return <RouterProvider router={router} />;
};

export default App;