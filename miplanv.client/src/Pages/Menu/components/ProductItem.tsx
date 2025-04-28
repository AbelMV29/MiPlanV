import { Card, CardContent, Typography, CardActions, Button, Box, Chip } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image'; // Icono para imagen vacía

interface ProductItemProps {
    name: string;
    image: string | null;
    description: string | null;
    isVegan: boolean;
}

export function ProductItem({ name, image, description, isVegan }: ProductItemProps) {
    const hasImage = Boolean(image);

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 220,
                borderRadius: 'var(--border-radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-lg)'
                }
            }}
        >
            <Box sx={{ width: '100%', position: 'relative', height: 140, bgcolor: hasImage ? 'transparent' : 'var(--color-fondo)' }}>
                {hasImage ? (
                    <Box
                        component="img"
                        src={`data:image/jpeg;base64, ${image}`}
                        alt={name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-texto-light)',
                            fontSize: '3rem'
                        }}
                    >
                        <ImageIcon fontSize="inherit" />
                    </Box>
                )}

                {hasImage && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            boxShadow: 'inset 0 0 30px 8px rgba(0, 0, 0, 0.4)',
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ p: 2 }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                    mb: 1
                }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontFamily: 'var(--font-family-heading)',
                            fontWeight: 600,
                            fontSize: '1.25rem',
                            textAlign: 'center'
                        }}
                    >
                        {name}
                    </Typography>
                    {isVegan && (
                        <Chip
                            label="Vegana"
                            color="success"
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 500 }}
                        />
                    )}
                </Box>

                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            fontFamily: 'var(--font-family-body)',
                            fontSize: '0.95rem',
                            textAlign: 'center'
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        bgcolor: 'var(--color-principal)',
                        color: 'white',
                        fontWeight: 600,
                        py: 1.2,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        '&:hover': {
                            bgcolor: 'var(--color-secundario-dark)', // Cambia a durazno oscuro
                            transform: 'scale(1.03)'
                        }
                    }}
                >
                    PEDIR
                </Button>
            </CardActions>

        </Card>
    );
}
