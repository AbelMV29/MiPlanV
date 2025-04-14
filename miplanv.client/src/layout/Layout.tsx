import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/layout/Header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            overflowX: 'hidden'
        }}>
            <Header />
            <Container 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3, md: 4 },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '100%', md: '1200px' },
                    margin: '0 auto'
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout; 