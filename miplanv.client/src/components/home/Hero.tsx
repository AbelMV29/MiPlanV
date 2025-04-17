import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../common/Logo';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 50,
      damping: 15
    }
  }
};

const pricingBoxVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      delay: 0.4,
      duration: 0.6,
      type: 'spring',
      stiffness: 100
    }
  }
};

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(135deg, var(--color-fondo) 0%, var(--color-card-beige) 100%)',
        pt: { xs: 4, sm: 8, md: 10 },
        pb: { xs: 8, sm: 10, md: 12 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Círculos decorativos */}
      <Box 
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-acento-2) 0%, rgba(77, 200, 194, 0) 70%)',
          opacity: 0.3,
          zIndex: 0,
          display: { xs: 'none', lg: 'block' }
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-acento) 0%, rgba(255, 154, 139, 0) 70%)',
          opacity: 0.25,
          zIndex: 0,
          display: { xs: 'none', lg: 'block' }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            alignItems: 'center'
          }}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box 
            sx={{ 
              width: { xs: '100%', md: '48%' },
              order: { xs: 2, md: 1 }
            }}
          >
            <Box component={motion.div} variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: 'var(--font-family-heading)',
                  fontWeight: 700,
                  fontSize: { xs: '3.2rem', sm: '4rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  color: 'var(--color-principal-dark)',
                  mb: 2,
                }}
              >
                Viandas caseras y saludables para toda la semana
              </Typography>
            </Box>

            <Box component={motion.div} variants={itemVariants}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'var(--font-family-body)',
                  color: 'var(--color-texto-light)',
                  mb: 4,
                  fontSize: { xs: '1.6rem', md: '1.8rem' },
                  lineHeight: 1.5,
                }}
              >
                Deja que nosotros cocinemos por ti. Viandas nutritivas, preparadas con ingredientes frescos y entregadas en tu puerta.
              </Typography>
            </Box>

            <Box 
              component={motion.div} 
              variants={itemVariants}
              sx={{ 
                display: 'flex', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                mb: 4
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                component={RouterLink}
                to="/order"
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 600,
                  fontSize: '1.6rem',
                  backgroundColor: 'var(--color-principal)',
                  '&:hover': {
                    backgroundColor: 'var(--color-principal-dark)',
                  },
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                Hacer Pedido
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<RestaurantMenuIcon />}
                component={RouterLink}
                to="/menu"
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 600,
                  fontSize: '1.6rem',
                  color: 'var(--color-principal)',
                  borderColor: 'var(--color-principal)',
                  '&:hover': {
                    borderColor: 'var(--color-principal-dark)',
                    backgroundColor: 'rgba(79, 121, 66, 0.04)',
                  },
                  borderRadius: 'var(--border-radius-sm)',
                }}
              >
                Ver Menú
              </Button>
            </Box>

            <Box 
              component={motion.div}
              variants={pricingBoxVariants}
              sx={{ 
                mt: 4,
                display: 'flex',
                gap: { xs: 2, sm: 3 },
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}
            >
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--border-radius-md)',
                  width: { xs: '45%', sm: 'auto' },
                  minWidth: { sm: '140px' }
                }}
              >
                <Typography 
                  align="center" 
                  variant="body2" 
                  sx={{ 
                    color: 'var(--color-principal)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-family-body)',
                    mb: 1
                  }}
                >
                  Individual
                </Typography>
                <Typography 
                  align="center" 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-texto)',
                    fontFamily: 'var(--font-family-heading)',
                  }}
                >
                  $7.400
                </Typography>
              </Paper>
              
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(235, 250, 235, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--border-radius-md)',
                  width: { xs: '45%', sm: 'auto' },
                  minWidth: { sm: '140px' }
                }}
              >
                <Typography 
                  align="center" 
                  variant="body2" 
                  sx={{ 
                    color: 'var(--color-principal-dark)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-family-body)',
                    mb: 1
                  }}
                >
                  Pack 7
                </Typography>
                <Typography 
                  align="center" 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-texto)',
                    fontFamily: 'var(--font-family-heading)',
                  }}
                >
                  $50.000
                </Typography>
              </Paper>
              
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 236, 224, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--border-radius-md)',
                  width: { xs: '45%', sm: 'auto' },
                  minWidth: { sm: '140px' }
                }}
              >
                <Typography 
                  align="center" 
                  variant="body2" 
                  sx={{ 
                    color: 'var(--color-secundario-dark)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-family-body)',
                    mb: 1
                  }}
                >
                  Pack 14
                </Typography>
                <Typography 
                  align="center" 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-texto)',
                    fontFamily: 'var(--font-family-heading)',
                  }}
                >
                  $98.000
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Box 
            sx={{ 
              width: { xs: '100%', md: '48%' },
              order: { xs: 1, md: 2 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Ilustración de logo grande (para mobile) */}
            {isMobile && (
              <Box 
                component={motion.div}
                variants={itemVariants}
                sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}
              >
                <Logo width={120} height={120} color="var(--color-principal)" />
              </Box>
            )}
            
            {/* Imágenes de comida (para tablet y desktop) */}
            {!isMobile && (
              <Box 
                component={motion.div}
                variants={itemVariants}
                sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: '480px'
                }}
              >
                {/* Logo en el medio */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '50%',
                    p: 1,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <Logo width={100} height={100} color="var(--color-principal)" />
                </Box>
                
                {/* Imagen 1 */}
                <Box
                  component={motion.div}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  sx={{
                    position: 'absolute',
                    top: '0',
                    left: isTablet ? '10%' : '20%',
                    width: isTablet ? '170px' : '200px',
                    height: isTablet ? '170px' : '200px',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    transform: 'rotate(-5deg)',
                    zIndex: 3,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(2px)',
                      zIndex: 1
                    }
                  }}
                >
                  <img 
                    src="https://source.unsplash.com/featured/?healthy,food" 
                    alt="Comida saludable"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 0
                    }}
                  />
                </Box>
                
                {/* Imagen 2 */}
                <Box
                  component={motion.div}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%) rotate(5deg)',
                    width: isTablet ? '150px' : '180px',
                    height: isTablet ? '150px' : '180px',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 2,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(2px)',
                      zIndex: 1
                    }
                  }}
                >
                  <img 
                    src="https://source.unsplash.com/featured/?vegetable,dish" 
                    alt="Plato vegetariano"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 0
                    }}
                  />
                </Box>
                
                {/* Imagen 3 */}
                <Box
                  component={motion.div}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: isTablet ? '10%' : '20%',
                    width: isTablet ? '170px' : '220px',
                    height: isTablet ? '170px' : '220px',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    transform: 'rotate(8deg)',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(2px)',
                      zIndex: 1
                    }
                  }}
                >
                  <img 
                    src="https://source.unsplash.com/featured/?meal,prep" 
                    alt="Preparación de comida"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 0
                    }}
                  />
                </Box>
                
                {/* Imagen 4 */}
                <Box
                  component={motion.div}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  sx={{
                    position: 'absolute',
                    top: '35%',
                    right: 0,
                    width: isTablet ? '130px' : '160px',
                    height: isTablet ? '130px' : '160px',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    transform: 'rotate(-10deg)',
                    zIndex: 2,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(2px)',
                      zIndex: 1
                    }
                  }}
                >
                  <img 
                    src="https://source.unsplash.com/featured/?lunch,box" 
                    alt="Lunch box"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 0
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero; 