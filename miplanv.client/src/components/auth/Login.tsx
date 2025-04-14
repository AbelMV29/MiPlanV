import React from 'react';
import { Box, Button, TextField, Typography, Divider, Link } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const loginSchema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email es requerido'),
    password: yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
        .matches(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
        .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial')
        .required('Contraseña es requerida'),
});

interface LoginProps {
    onLogin: (email: string, password: string) => void;
    onGoogleLogin: (response: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoogleLogin }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginSchema.validate({ email, password }, { abortEarly: false });
            onLogin(email, password);
        } catch (error: any) {
            const validationErrors: { [key: string]: string } = {};
            error.inner.forEach((err: any) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
            />
            <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ 
                    mt: 2,
                    backgroundColor: 'var(--color-principal)',
                    '&:hover': {
                        backgroundColor: 'var(--color-secundario)',
                    }
                }}
            >
                Iniciar Sesión
            </Button>

            <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">o</Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={onGoogleLogin}
                        onError={() => {
                            console.error('Error al iniciar sesión con Google');
                        }}
                    />
                </GoogleOAuthProvider>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    ¿No tienes una cuenta?{' '}
                    <Link 
                        component="button"
                        onClick={() => navigate('/register')}
                        sx={{ 
                            color: 'var(--color-principal)',
                            textDecoration: 'none',
                            '&:hover': {
                                color: 'var(--color-secundario)',
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Regístrate
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login; 