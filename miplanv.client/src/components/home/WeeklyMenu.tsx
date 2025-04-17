import React from 'react';
import { 
  Box, 
  Typography, 
  Grid as MuiGrid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Divider,
  Container
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NatureIcon from '@mui/icons-material/Nature';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { motion } from 'framer-motion';

// Tipos de datos
interface MenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isVegan: boolean;
  isSpicy?: boolean;
  price?: number;
}

interface MenuDay {
  day: string;
  date: string;
  items: MenuItem[];
}

interface WeeklyMenuProps {
  title?: string;
  subtitle?: string;
  weeklyData: MenuDay[];
}

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 }
  }
};

// Componente principal
const WeeklyMenu: React.FC<WeeklyMenuProps> = ({ 
  title = "Menú Semanal", 
  subtitle = "Descubre nuestras deliciosas viandas preparadas con ingredientes frescos", 
  weeklyData 
}) => {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: 8,
        backgroundColor: 'var(--color-fondo)',
      }}
    >
      <Container>
        <Typography 
          variant="h2" 
          component="h2" 
          align="center"
          sx={{ 
            mb: 1,
            color: 'var(--color-principal-dark)',
            fontFamily: 'var(--font-family-heading)',
            fontWeight: 700
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h5" 
          component="p" 
          align="center"
          sx={{ 
            mb: 6,
            color: 'var(--color-texto-light)',
            fontFamily: 'var(--font-family-body)',
            maxWidth: '700px',
            mx: 'auto'
          }}
        >
          {subtitle}
        </Typography>

        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 4
          }}
        >
          {weeklyData.map((day) => (
            <Box
              key={day.day}
              component={motion.div}
              variants={itemVariants}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 'var(--shadow-lg)'
                  }
                }}
              >
                <Box sx={{ 
                  bgcolor: 'rgba(79, 121, 66, 0.85)', 
                  backdropFilter: 'blur(8px)',
                  color: 'white', 
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" component="h3" sx={{ fontFamily: 'var(--font-family-heading)' }}>
                    {day.day}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'var(--font-family-body)' }}>
                    {day.date}
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {day.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                        <CardMedia
                          component="img"
                          sx={{ 
                            width: 70, 
                            height: 70, 
                            borderRadius: 'var(--border-radius-sm)',
                            objectFit: 'cover'
                          }}
                          image={item.imageUrl || `https://source.unsplash.com/100x100/?food,${item.name}`}
                          alt={item.name}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="subtitle1" 
                              component="h4" 
                              sx={{ 
                                fontWeight: 600,
                                fontFamily: 'var(--font-family-body)',
                                fontSize: '1.5rem'
                              }}
                            >
                              {item.name}
                            </Typography>
                            {item.isVegan && (
                              <Chip 
                                icon={<NatureIcon />} 
                                label="Veggie" 
                                size="small" 
                                sx={{ 
                                  bgcolor: 'var(--color-card-verde)', 
                                  color: 'var(--color-principal-dark)',
                                  fontWeight: 500,
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }}
                              />
                            )}
                            {item.isSpicy && (
                              <Chip 
                                icon={<WhatshotIcon />} 
                                label="Picante" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#FEE2E2', 
                                  color: '#E53E3E',
                                  fontWeight: 500,
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }}
                              />
                            )}
                          </Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mb: 1,
                              fontFamily: 'var(--font-family-body)',
                              fontSize: '1.2rem',
                              lineHeight: 1.3
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                      {index < day.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </CardContent>
                
                <Box sx={{ p: 2, bgcolor: 'rgba(245, 240, 230, 0.7)', backdropFilter: 'blur(8px)' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<RestaurantIcon />}
                    sx={{ 
                      bgcolor: 'var(--color-secundario)',
                      '&:hover': {
                        bgcolor: 'var(--color-secundario-dark)'
                      },
                      py: 1
                    }}
                  >
                    Ver Opciones
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WeeklyMenu; 