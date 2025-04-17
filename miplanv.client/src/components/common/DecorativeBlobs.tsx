import React from 'react';
import { Box } from '@mui/material';

type BlobVariant = 'colorful' | 'subtle' | 'minimal';

interface DecorativeBlobsProps {
  variant?: BlobVariant;
}

const DecorativeBlobs: React.FC<DecorativeBlobsProps> = ({ variant = 'colorful' }) => {
  // Colores para los diferentes variantes
  const getColors = () => {
    switch (variant) {
      case 'colorful':
        return {
          primary: '#3f51b5',
          secondary: '#f50057',
          tertiary: '#00bcd4',
          quaternary: '#ff9800',
        };
      case 'subtle':
        return {
          primary: '#9fa8da',
          secondary: '#f8bbd0',
          tertiary: '#80deea',
          quaternary: '#ffe0b2',
        };
      case 'minimal':
        return {
          primary: '#e0e0e0',
          secondary: '#eeeeee',
          tertiary: '#f5f5f5',
          quaternary: '#fafafa',
        };
      default:
        return {
          primary: '#3f51b5',
          secondary: '#f50057',
          tertiary: '#00bcd4',
          quaternary: '#ff9800',
        };
    }
  };

  const colors = getColors();

  return (
    <>
      {/* Blob superior izquierdo */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: colors.primary,
          filter: 'blur(70px)',
          opacity: 0.5,
          zIndex: 0,
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0) scale(1)' },
            '50%': { transform: 'translateY(-20px) scale(1.05)' },
            '100%': { transform: 'translateY(0) scale(1)' },
          },
        }}
      />

      {/* Blob inferior derecho */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '45%',
          height: '45%',
          borderRadius: '60% 40% 70% 30% / 40% 50% 60% 50%',
          background: colors.secondary,
          filter: 'blur(70px)',
          opacity: 0.5,
          zIndex: 0,
          animation: 'floatReverse 10s ease-in-out infinite',
          '@keyframes floatReverse': {
            '0%': { transform: 'translateY(0) rotate(0)' },
            '50%': { transform: 'translateY(20px) rotate(5deg)' },
            '100%': { transform: 'translateY(0) rotate(0)' },
          },
        }}
      />

      {/* Blob central */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          right: '30%',
          width: '30%',
          height: '30%',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          background: colors.tertiary,
          filter: 'blur(70px)',
          opacity: 0.4,
          zIndex: 0,
          animation: 'pulse 12s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      />

      {/* Blob inferior izquierdo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '25%',
          height: '25%',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: colors.quaternary,
          filter: 'blur(60px)',
          opacity: 0.3,
          zIndex: 0,
          animation: 'floatSpin 15s linear infinite',
          '@keyframes floatSpin': {
            '0%': { transform: 'translateY(0) rotate(0)' },
            '25%': { transform: 'translateY(-10px) rotate(90deg)' },
            '50%': { transform: 'translateY(0) rotate(180deg)' },
            '75%': { transform: 'translateY(10px) rotate(270deg)' },
            '100%': { transform: 'translateY(0) rotate(360deg)' },
          },
        }}
      />
    </>
  );
};

export default DecorativeBlobs; 