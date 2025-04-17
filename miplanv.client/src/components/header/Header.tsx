import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
    AppBar, 
    Toolbar, 
    IconButton, 
    Typography, 
    Button, 
    Menu, 
    MenuItem, 
    Box, 
    Container,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import { 
    AccountCircle, 
    Login as LoginIcon, 
    Menu as MenuIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    RestaurantMenu as MenuFoodIcon,
    ShoppingCart as CartIcon,
    Info as InfoIcon 
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate, BrowserRouter, Link as RouterLink } from 'react-router-dom';
import Login from '../auth/Login';
import authService from '../../services/auth.service';
import useAuthStore from '../../store/useAuthStore';
import Logo from '../common/Logo';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, login, logout } = useAuthStore();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogin = () => {
        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-form';
        
        Swal.fire({
            title: 'Iniciar Sesión',
            html: loginContainer,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            showConfirmButton: false,
            allowOutsideClick: true,
            customClass: {
                cancelButton: 'swal2-cancel-custom',
                popup: 'swal2-popup-custom'
            },
            didOpen: () => {
                // Agregar estilos al botón de cancelar
                const styleTag = document.createElement('style');
                styleTag.innerHTML = `
                    .swal2-cancel-custom {
                        background-color: transparent !important;
                        color: var(--color-principal) !important;
                        border: 1px solid var(--color-principal) !important;
                        font-family: var(--font-family-body) !important;
                    }
                    .swal2-popup-custom {
                        border-radius: var(--border-radius-md) !important;
                        padding: 2rem !important;
                    }
                `;
                document.head.appendChild(styleTag);
                
                const rootElement = document.getElementById('login-form');
                if (rootElement) {
                    const root = createRoot(rootElement);
                    const loginComponent = (
                        <BrowserRouter>
                            <Login
                                onLogin={async (email, password) => {
                                    try {
                                        const userData = await authService.login(email, password);
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

    // Lista de navegación
    const navItems = [
        { label: 'Inicio', icon: <HomeIcon />, path: '/' },
        { label: 'Menú', icon: <MenuFoodIcon />, path: '/menu' },
        { label: 'Sobre Nosotros', icon: <InfoIcon />, path: '/about' }
    ];

    const renderDesktopMenu = () => (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {navItems.map((item) => (
                    <Button 
                        key={item.label}
                        component={RouterLink}
                        to={item.path}
                        color="inherit"
                        sx={{ 
                            fontFamily: 'var(--font-family-body)',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <Button 
                            color="inherit"
                            startIcon={<CartIcon />}
                            onClick={() => navigate('/cart')}
                            sx={{ mr: 2 }}
                        >
                            Carrito
                        </Button>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            height: '36px',
                            transform: 'translateY(-2px)'
                        }}>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    fontFamily: 'var(--font-family-body)',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    mr: 1,
                                    lineHeight: 1
                                }}
                            >
                                HOLA {user?.name?.split(' ')[0] || 'Usuario'}
                            </Typography>
                        </Box>
                        <IconButton
                            aria-label="cuenta de usuario"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            sx={{ 
                                fontSize: '1.8rem',
                                p: '4px',
                                transform: 'translateY(-2px)'
                            }}
                        >
                            <AccountCircle fontSize="large" />
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
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate('/orders');
                            }}>Mis Pedidos</MenuItem>
                            {user?.role === 'Admin' && (
                                <MenuItem onClick={() => {
                                    handleClose();
                                    navigate('/admin');
                                }}>Panel de Administración</MenuItem>
                            )}
                            <Divider />
                            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/register"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                mr: 2,
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Registrarse
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<LoginIcon />}
                            onClick={handleLogin}
                            sx={{
                                bgcolor: 'var(--color-acento-dark)',
                                '&:hover': {
                                    bgcolor: 'var(--color-acento)'
                                }
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </>
                )}
            </Box>
        </>
    );

    const renderMobileMenu = () => (
        <>
            <IconButton
                color="inherit"
                aria-label="menu"
                edge="start"
                onClick={handleMobileMenuToggle}
                sx={{ display: { md: 'none' } }}
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={handleMobileMenuToggle}
                sx={{
                    '& .MuiDrawer-paper': { 
                        width: '85%', 
                        maxWidth: '300px',
                        boxSizing: 'border-box',
                        bgcolor: 'var(--color-card-beige)'
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontFamily: 'var(--font-family-heading)',
                            color: 'var(--color-principal)'
                        }}
                    >
                        MiPlanV
                    </Typography>
                    <IconButton onClick={handleMobileMenuToggle}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <Divider />
                
                <List>
                    {navItems.map((item) => (
                        <ListItem 
                            key={item.label} 
                            disablePadding
                        >
                            <ListItemButton
                                component={RouterLink} 
                                to={item.path}
                                onClick={handleMobileMenuToggle}
                            >
                                <ListItemIcon sx={{ color: 'var(--color-principal)' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    primaryTypographyProps={{ 
                                        sx: { fontFamily: 'var(--font-family-body)' } 
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    
                    {isAuthenticated && (
                        <>
                            <ListItem 
                                disablePadding
                            >
                                <ListItemButton
                                    component={RouterLink} 
                                    to="/cart"
                                    onClick={handleMobileMenuToggle}
                                >
                                    <ListItemIcon sx={{ color: 'var(--color-principal)' }}>
                                        <CartIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Carrito" 
                                        primaryTypographyProps={{ 
                                            sx: { fontFamily: 'var(--font-family-body)' } 
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem 
                                disablePadding
                            >
                                <ListItemButton
                                    component={RouterLink} 
                                    to="/profile"
                                    onClick={handleMobileMenuToggle}
                                >
                                    <ListItemIcon sx={{ color: 'var(--color-principal)' }}>
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Mi Perfil" 
                                        primaryTypographyProps={{ 
                                            sx: { fontFamily: 'var(--font-family-body)' } 
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
                
                <Divider />
                
                <Box sx={{ p: 2 }}>
                    {isAuthenticated ? (
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                handleLogout();
                                handleMobileMenuToggle();
                            }}
                            sx={{
                                bgcolor: 'var(--color-principal)',
                                '&:hover': {
                                    bgcolor: 'var(--color-principal-dark)'
                                }
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => {
                                    handleLogin();
                                    handleMobileMenuToggle();
                                }}
                                sx={{
                                    bgcolor: 'var(--color-acento-dark)',
                                    '&:hover': {
                                        bgcolor: 'var(--color-acento)'
                                    }
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                component={RouterLink}
                                to="/register"
                                onClick={handleMobileMenuToggle}
                                sx={{
                                    color: 'var(--color-principal)',
                                    borderColor: 'var(--color-principal)',
                                    '&:hover': {
                                        borderColor: 'var(--color-principal-dark)',
                                        color: 'var(--color-principal-dark)',
                                        bgcolor: 'rgba(79, 121, 66, 0.1)'
                                    }
                                }}
                            >
                                Registrarse
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );

    return (
        <AppBar 
            position="sticky" 
            sx={{ 
                backgroundColor: 'var(--color-principal)',
                boxShadow: 'var(--shadow-md)'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: { xs: '0.8rem 1rem', md: '1rem 2rem' },
                }}>
                    {isMobile && renderMobileMenu()}
                    
                    <Box 
                        component={RouterLink} 
                        to="/"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'white',
                            gap: 1.5
                        }}
                    >
                        <Logo width={36} height={36} color="white" />
                        <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                                fontFamily: 'var(--font-family-heading)',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                fontSize: { xs: '1.8rem', md: '2.2rem' }
                            }}
                        >
                            MiPlanV
                        </Typography>
                    </Box>
                    
                    {!isMobile && renderDesktopMenu()}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;