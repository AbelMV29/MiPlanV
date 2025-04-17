import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Link, CircularProgress, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import * as yup from 'yup';
import authService from '../../services/auth.service';

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
    onRegisterClick?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoogleLogin, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        
        try {
            setLoading(true);
            await loginSchema.validate({ email, password }, { abortEarly: false });
            
            // Si la validación pasa, intentamos iniciar sesión
            onLogin(email, password);

        } catch (error: any) {
            const validationErrors: { [key: string]: string } = {};
            error.inner.forEach((err: any) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse: any) => {
        setErrorMessage(null);
        setLoading(true);
        
        try {
            // Decodificar el token de Google
            const tokenParts = credentialResponse.credential.split('.');
            const decodedToken = JSON.parse(atob(tokenParts[1]));

            // Llamar al servicio para iniciar sesión con Google
            const response = await authService.googleLogin(decodedToken);
            
            onGoogleLogin(response);
        } catch (error: any) {
            setErrorMessage(error.message || 'Error al iniciar sesión con Google');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        if (onRegisterClick) {
            onRegisterClick();
        } else {
            window.location.href = '/register';
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            
            <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                disabled={loading}
            />
            
            <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                disabled={loading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            
            <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                    mt: 2,
                    backgroundColor: 'var(--color-acento)',
                    '&:hover': {
                        backgroundColor: 'var(--color-acento-dark)',
                    }
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>

            <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">o</Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                            setErrorMessage('Error al iniciar sesión con Google');
                        }}
                        useOneTap
                        theme="filled_blue" 
                        text="signin_with"
                        shape="rectangular"
                        locale="es"
                        context="signin"
                    />
                </GoogleOAuthProvider>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    ¿No tienes una cuenta?{' '}
                    <Link 
                        component="button"
                        onClick={handleRegisterClick}
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