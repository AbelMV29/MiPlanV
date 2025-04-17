import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/header/Header';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            overflowX: 'hidden',
            backgroundImage: 'linear-gradient(135deg, var(--color-fondo) 0%, var(--color-card-beige) 100%)',
            position: 'relative'
        }}>
            {/* Círculos decorativos */}
            <Box 
                sx={{
                    position: 'fixed',
                    top: '15%',
                    left: '5%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-acento-2) 0%, rgba(77, 200, 194, 0) 70%)',
                    opacity: 0.4,
                    zIndex: 0,
                    display: { xs: 'none', md: 'block' }
                }}
            />
            
            <Box 
                sx={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '8%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-acento) 0%, rgba(255, 154, 139, 0) 70%)',
                    opacity: 0.3,
                    zIndex: 0,
                    display: { xs: 'none', md: 'block' }
                }}
            />
            
            <Box 
                sx={{
                    position: 'fixed',
                    top: '60%',
                    right: '15%',
                    width: '250px',
                    height: '250px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-acento-2) 0%, rgba(77, 200, 194, 0) 70%)',
                    opacity: 0.3,
                    zIndex: 0,
                    display: { xs: 'none', lg: 'block' }
                }}
            />
            
            <Header />
            <Container 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3, md: 4 },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '100%', md: '1200px' },
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout; 