import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Avatar, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, Login as LoginIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Login from '../auth/Login';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                const root = document.getElementById('login-form');
                if (root) {
                    const loginComponent = (
                        <Login
                            onLogin={(email: string, password: string) => {
                                setIsAuthenticated(true);
                                Swal.close();
                            }}
                            onGoogleLogin={(response: any) => {
                                setIsAuthenticated(true);
                                Swal.close();
                            }}
                        />
                    );
                    // @ts-ignore
                    ReactDOM.render(loginComponent, root);
                }
            }
        });
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
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