import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, Login as LoginIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import Login from '../auth/Login';
import authService from '../../services/auth.service';
import useAuthStore from '../../store/useAuthStore';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, isAuthenticated, login, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-form';
        
        Swal.fire({
            title: 'Iniciar Sesión',
            html: loginContainer,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                const rootElement = document.getElementById('login-form');
                if (rootElement) {
                    const root = createRoot(rootElement);
                    const loginComponent = (
                        <BrowserRouter>
                            <Login
                                onLogin={async (email, password) => {
                                    try {
                                        const userData = await authService.login(email, password);
                                        // El token ya ha sido guardado por authService.login
                                        // Solo necesitamos actualizar el estado del store
                                        login(
                                            {
                                                id: userData.userId.toString(),
                                                name: userData.name,
                                                email: userData.email,
                                                role: userData.role
                                            }, 
                                            userData.token
                                        );
                                        
                                        Swal.close();
                                    } catch (error) {
                                        // El error ya se maneja en el componente Login
                                    }
                                }}
                                onGoogleLogin={(response) => {
                                    // El token y la información de usuario ya han sido procesados
                                    // Solo necesitamos actualizar el estado del store
                                    login(
                                        {
                                            id: response.userId.toString(),
                                            name: response.name,
                                            email: response.email,
                                            role: response.role
                                        }, 
                                        response.token
                                    );
                                    
                                    Swal.close();
                                }}
                                onRegisterClick={() => {
                                    Swal.close();
                                    navigate('/register');
                                }}
                            />
                        </BrowserRouter>
                    );
                    root.render(loginComponent);
                }
            }
        });
    };

    const handleLogout = async () => {
        await authService.logout();
        logout();
        handleClose();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'var(--color-principal)' }}>
            <Toolbar sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: { xs: '100%', sm: '100%', md: '1200px' },
                margin: '0 auto',
                px: { xs: 2, sm: 3, md: 4 }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        MiPlanV
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    {isAuthenticated ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    Hola, {user?.name || 'Usuario'}
                                </Typography>
                            </Box>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {
                                    handleClose();
                                    navigate('/profile');
                                }}>Mi Perfil</MenuItem>
                                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            startIcon={<LoginIcon />}
                            onClick={handleLogin}
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;