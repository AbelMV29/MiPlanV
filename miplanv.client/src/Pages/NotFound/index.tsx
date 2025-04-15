import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import sitioConstruccion from '../../assets/sitioConstruccion.jpg';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        minHeight: 'calc(100vh - 64px)'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          textAlign: 'center',
          color: 'var(--color-principal)',
          fontWeight: 'bold',
          mb: 2
        }}
      >
        Página no encontrada
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          textAlign: 'center',
          mb: 4,
          maxWidth: 600
        }}
      >
        Lo sentimos, la página que estás buscando no existe o está en construcción.
      </Typography>
      
      <Box 
        component="img"
        src={sitioConstruccion}
        alt="Sitio en construcción"
        sx={{
          maxWidth: '100%',
          height: 'auto',
          maxHeight: 400,
          mb: 4,
          borderRadius: 2,
          boxShadow: 3
        }}
      />
      
      <Button 
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ 
          mt: 2,
          backgroundColor: 'var(--color-principal)',
          '&:hover': {
            backgroundColor: 'var(--color-secundario)'
          }
        }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFound; 