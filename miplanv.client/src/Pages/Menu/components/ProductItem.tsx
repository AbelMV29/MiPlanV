import { Card, CardContent, Typography, CardActions, Button, CardMedia, Box, Chip } from "@mui/material";

interface ProductItemProps {
    name: string,
    image: string | null,
    description: string | null,
    isVegan: boolean
}

export function ProductItem({ name, image, description, isVegan }: ProductItemProps) {
    return (<Card sx={{ width: 'max-content', maxWidth: 150, mb: 3 }}>
        <Box sx={{ width: '100%', position: 'relative' }}>
            <Box
                component="img"
                src={`data:image/jpeg;base64, ${image}`}
                sx={{
                    width: '100%',
                    display: 'block'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    boxShadow: 'inset 0 0 20px 1px rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none',
                }}
            />
        </Box>
        <CardContent sx={{
            p:2
        }}>
            <Box sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                pb: 1,
                
            }}>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                {isVegan &&
                    <Chip label="Vegana" color="success" size="small" />}
            </Box>
            {description &&
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>{description}</Typography>}
        </CardContent>
        <CardActions>
            <Button size="small" variant="contained" sx={{backgroundColor:'green'}}>Pedir</Button>
        </CardActions>
    </Card>);
}