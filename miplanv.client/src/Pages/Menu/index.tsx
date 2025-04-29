import React from 'react';
import { Box, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useService } from '../../hooks/useService';
import { CurrentPackedLunch } from '../../models/packedLunch';
import { packedLunchService } from '../../services/packed-lunch.service';
import { WeeklyProductsGrid } from './components/WeeklyProductsGrid';

const Menu: React.FC = () => {

  const [loading, error, packedLunches] = useService<CurrentPackedLunch[]>(async () => await packedLunchService.getCurrents(), [], []);

  console.log(packedLunches);

  return (
    <Box component="section" sx={{ py: 8, backgroundColor: 'var(--color-fondo)' }}>
      <Container>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
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
          Descubre nuestras viandas saludables, listas para disfrutar cada día de la semana.
        </Typography>

        {loading ? (<Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>) : (<WeeklyProductsGrid products={packedLunches} />)}
      </Container>
    </Box>
  );
};

export default Menu;