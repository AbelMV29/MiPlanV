import React from 'react';
import { Box, Typography } from '@mui/material';
import WeeklyMenu from '../../components/home/WeeklyMenu';

// Datos para el menú semanal (mismo formato que en WeeklyMenu)
const weeklyData = [
  {
    day: 'Lunes',
    date: '22 de Abril',
    items: [
      {
        id: 1,
        name: 'Bowl de Quinoa',
        description: 'Con vegetales asados, tofu y aderezo de tahini',
        imageUrl: 'https://source.unsplash.com/featured/?quinoa,bowl',
        isVegan: true
      },
      {
        id: 2,
        name: 'Curry de Garbanzos',
        description: 'Con arroz basmati y vegetales',
        imageUrl: 'https://source.unsplash.com/featured/?curry,chickpea',
        isVegan: true
      }
    ]
  },
  {
    day: 'Martes',
    date: '23 de Abril',
    items: [
      {
        id: 3,
        name: 'Pasta Primavera',
        description: 'Pasta integral con verduras salteadas y pesto de albahaca',
        imageUrl: 'https://source.unsplash.com/featured/?pasta,primavera',
        isVegan: true
      },
      {
        id: 4,
        name: 'Ensalada de Lentejas',
        description: 'Con tomate, cebolla morada y aderezo de limón',
        imageUrl: 'https://source.unsplash.com/featured/?lentil,salad',
        isVegan: true
      }
    ]
  },
  {
    day: 'Miércoles',
    date: '24 de Abril',
    items: [
      {
        id: 5,
        name: 'Burrito Bowl',
        description: 'Con frijoles negros, arroz, guacamole y salsa',
        imageUrl: 'https://source.unsplash.com/featured/?burrito,bowl',
        isVegan: true
      },
      {
        id: 6,
        name: 'Sopa Tailandesa',
        description: 'Con leche de coco, vegetales y tofu',
        imageUrl: 'https://source.unsplash.com/featured/?thai,soup',
        isVegan: true,
        isSpicy: true
      }
    ]
  }
];

const Menu: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography 
        variant="h1" 
        component="h1" 
        align="center"
        sx={{ 
          mb: 2,
          color: 'var(--color-principal-dark)',
          fontFamily: 'var(--font-family-heading)',
          fontWeight: 700,
          fontSize: { xs: '2.5rem', md: '3.5rem' }
        }}
      >
        Nuestro Menú
      </Typography>
      
      <Typography 
        variant="h5" 
        component="p" 
        align="center"
        sx={{ 
          mb: 6,
          color: 'var(--color-texto-light)',
          fontFamily: 'var(--font-family-body)',
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        Descubre nuestras deliciosas viandas preparadas con ingredientes frescos y de temporada. 
        Comida saludable y lista para disfrutar en cualquier momento.
      </Typography>
      
      <WeeklyMenu 
        title="Menú Semanal" 
        subtitle="Nuestras opciones para esta semana" 
        weeklyData={weeklyData} 
      />
    </Box>
  );
};

export default Menu; 