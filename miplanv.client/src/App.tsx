import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './styles/global.css';
import useAuthStore from './store/useAuthStore';
import { CircularProgress, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Crear tema personalizado
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px var(--color-fondo) inset !important;
          -webkit-text-fill-color: var(--color-texto) !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `,
    },
  },
});

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

export default App;