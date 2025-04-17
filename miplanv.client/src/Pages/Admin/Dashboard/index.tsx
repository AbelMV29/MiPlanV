import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  PeopleOutline as PeopleIcon,
  ShoppingCartOutlined as CartIcon,
  AttachMoneyOutlined as MoneyIcon,
  RestaurantMenuOutlined as MenuIcon
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Datos de ejemplo para el dashboard
  const stats = [
    { title: 'Usuarios', value: '128', icon: <PeopleIcon fontSize="large" sx={{ color: 'var(--color-primario)' }} /> },
    { title: 'Pedidos', value: '64', icon: <CartIcon fontSize="large" sx={{ color: 'var(--color-secundario)' }} /> },
    { title: 'Ingresos', value: '$2,854', icon: <MoneyIcon fontSize="large" sx={{ color: 'var(--color-acento)' }} /> },
    { title: 'Productos', value: '24', icon: <MenuIcon fontSize="large" sx={{ color: 'var(--color-acento-2)' }} /> },
  ];

  const recentOrders = [
    { id: '#ORD-123', customer: 'María López', date: '12/05/2023', amount: '$58.00', status: 'Completado' },
    { id: '#ORD-124', customer: 'Juan Pérez', date: '12/05/2023', amount: '$125.00', status: 'Pendiente' },
    { id: '#ORD-125', customer: 'Ana García', date: '11/05/2023', amount: '$42.00', status: 'Procesando' },
    { id: '#ORD-126', customer: 'Carlos Ruiz', date: '10/05/2023', amount: '$76.50', status: 'Completado' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--color-secundario)' }}>
        Dashboard
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Bienvenido al panel de administración de MiPlanV
      </Typography>
      
      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
                height: '100%'
              }}
            >
              {stat.icon}
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={4}>
        {/* Pedidos recientes */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ boxShadow: 'var(--shadow-sm)', borderRadius: 2 }}>
            <CardHeader 
              title="Pedidos recientes" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <List sx={{ width: '100%' }}>
                {recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem
                      secondaryAction={
                        <Chip 
                          label={order.status} 
                          size="small"
                          color={
                            order.status === 'Completado' ? 'success' : 
                            order.status === 'Pendiente' ? 'warning' : 'info'
                          }
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: '4px',
                          }}
                        />
                      }
                      sx={{ py: 1.5 }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {order.id}
                            </Typography>
                            <Typography variant="body2">
                              {order.customer}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {order.date}
                            </Typography>
                            <Typography variant="caption" fontWeight="bold">
                              {order.amount}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Actividad reciente */}
        <Grid xs={12} md={6}>
          <Card elevation={0} sx={{ boxShadow: 'var(--shadow-sm)', borderRadius: 2 }}>
            <CardHeader 
              title="Actividad reciente" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Aquí se mostrarán las actividades recientes del sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 