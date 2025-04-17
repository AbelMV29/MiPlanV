import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery, Divider, Avatar, ListItemButton, Button } from '@mui/material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CampaignIcon from '@mui/icons-material/Campaign';
import HomeIcon from '@mui/icons-material/Home';
import DecorativeBlobs from '../components/common/DecorativeBlobs';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
  { text: 'Usuarios', path: '/admin/usuarios', icon: <PeopleIcon /> },
  { text: 'Productos', path: '/admin/productos', icon: <LocalOfferIcon /> },
  { text: 'Facturas', path: '/admin/facturas', icon: <ReceiptIcon /> },
  { text: 'Campañas', path: '/admin/campanas', icon: <CampaignIcon /> },
  { text: 'Configuración', path: '/admin/configuracion', icon: <SettingsIcon /> },
];

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-secundario)' }}>
          MiPlanV
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <Box sx={{ mt: 2, px: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'var(--color-primario)' }}>
          <AccountCircleIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Admin User
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Administrador
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '8px',
                mx: 1,
                bgcolor: location.pathname === item.path ? 'var(--color-primario-light)' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === item.path 
                    ? 'var(--color-primario)' 
                    : 'var(--color-gris-light)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'white' : 'inherit',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<HomeIcon />}
          component={Link}
          to="/"
          sx={{ 
            mb: 2,
            borderColor: 'var(--color-primario)',
            color: 'var(--color-primario)',
            '&:hover': {
              borderColor: 'var(--color-primario-dark)',
              bgcolor: 'rgba(79, 121, 66, 0.1)'
            }
          }}
        >
          Volver al sitio
        </Button>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          © 2023 MiPlanV
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      position: 'relative', 
      overflow: 'hidden', 
      minHeight: '100vh',
      width: '100vw',
      backgroundImage: 'linear-gradient(135deg, var(--color-fondo) 0%, var(--color-card-beige) 100%)',
    }}>
      {/* Fondo decorativo con blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        <DecorativeBlobs variant="subtle" />
        
        {/* Círculos decorativos adicionales */}
        <Box 
          sx={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-acento-2) 0%, rgba(77, 200, 194, 0) 70%)',
            opacity: 0.3,
          }}
        />
        
        <Box 
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-acento) 0%, rgba(255, 154, 139, 0) 70%)',
            opacity: 0.25,
          }}
        />
      </Box>
      
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'var(--color-primario)' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'var(--color-primario)' }}>
            Panel de Administración
          </Typography>
          <IconButton color="inherit" sx={{ color: 'var(--color-primario)' }}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={isMobile ? handleDrawerToggle : undefined}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0,0,0,0.05)',
              boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.1)', md: 'none' }
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          px: { md: 5 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          position: 'relative',
          zIndex: 1,
          maxWidth: { lg: 'calc(100vw - 240px)', xl: '1600px' },
          mx: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 