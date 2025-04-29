import { Container, Box, Typography, Alert, Paper } from "@mui/material";

interface CustomDashboard {
    children: React.ReactNode,
    title: string,
    error: string | null
}

export function CustomDashboard({ children, title, error }: CustomDashboard) {
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--color-secundario)' }}>
                    {title}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
            </Box>
            <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 'var(--shadow-sm)',
                        mb: 4,
                        mx: 'auto',
                        maxWidth: '95%'
                    }}>
                    {children}
                </Paper>
        </Container>);
}