import React, { useState, useCallback } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Tooltip, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import userService from '../../services/user.service';
import Swal from 'sweetalert2';
    
const passwordRequirements = [
    'Mínimo 8 caracteres',
    'Al menos una mayúscula',
    'Al menos una minúscula',
    'Al menos un número',
    'Al menos un carácter especial'
];

const registerSchema = yup.object().shape({
    firstName: yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 letras')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
    lastName: yup.string()
        .required('El apellido es requerido')
        .min(3, 'El apellido debe tener al menos 3 letras')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),
    email: yup.string()
        .email('Email inválido')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'El email debe tener un dominio válido (ej: usuario@dominio.com)')
        .required('Email es requerido'),
    phoneNumber: yup.string()
        .matches(/^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Formato de teléfono inválido (ej: 123-456-7890)'),
    password: yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
        .matches(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
        .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial')
        .required('Contraseña es requerida'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirmar contraseña es requerida'),
});

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateField = useCallback(async (name: string, value: string) => {
        try {
            await registerSchema.validateAt(name, { [name]: value });
            setErrors(prev => ({ ...prev, [name]: '' }));
        } catch (error: any) {
            if (name === 'password') {
                const missingRequirements = [];
                if (value.length < 8) missingRequirements.push('Mínimo 8 caracteres');
                if (!/[A-Z]/.test(value)) missingRequirements.push('Al menos una mayúscula');
                if (!/[a-z]/.test(value)) missingRequirements.push('Al menos una minúscula');
                if (!/[0-9]/.test(value)) missingRequirements.push('Al menos un número');
                if (!/[^A-Za-z0-9]/.test(value)) missingRequirements.push('Al menos un carácter especial (ej: !@#$%^&*)');
                
                const errorMessage = missingRequirements.length > 0 
                    ? 'La contraseña debe cumplir con los siguientes requisitos:\n' + 
                      missingRequirements.map(req => `• ${req}`).join('\n')
                    : '';
                
                setErrors(prev => ({ ...prev, [name]: errorMessage }));
            } else {
                setErrors(prev => ({ ...prev, [name]: error.message }));
            }
        }
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (touched[name]) {
            validateField(name, value);
        }
    }, [touched, validateField]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formData[name as keyof typeof formData]);
    }, [formData, validateField]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerSchema.validate(formData, { abortEarly: false });
            
            await userService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber
            });

            await Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente',
                icon: 'success',
                confirmButtonColor: 'var(--color-principal)'
            });

            navigate('/login');
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const validationErrors: { [key: string]: string } = {};
                error.inner.forEach((err: any) => {
                    if (err.path === 'password') {
                        const missingRequirements = [];
                        if (!/[A-Z]/.test(formData.password)) missingRequirements.push('Al menos una mayúscula');
                        if (!/[a-z]/.test(formData.password)) missingRequirements.push('Al menos una minúscula');
                        if (!/[0-9]/.test(formData.password)) missingRequirements.push('Al menos un número');
                        if (!/[^A-Za-z0-9]/.test(formData.password)) missingRequirements.push('Al menos un carácter especial (ej: !@#$%^&*)');
                        if (formData.password.length < 8) missingRequirements.push('Mínimo 8 caracteres');
                        
                        validationErrors.password = 'La contraseña debe cumplir con los siguientes requisitos:\n' + 
                            missingRequirements.map(req => `• ${req}`).join('\n');
                    } else {
                        validationErrors[err.path] = err.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                await Swal.fire({
                    title: 'Error',
                    text: error.message || 'Error al registrar el usuario',
                    icon: 'error',
                    confirmButtonColor: 'var(--color-principal)'
                });
            }
        }
    }, [formData, navigate]);

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                maxWidth: '600px !important',
                width: '100%',
                px: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 3, sm: 4, md: 5 }, 
                    mt: { xs: 4, sm: 6, md: 8 },
                    backgroundColor: 'var(--color-card-beige)',
                    width: '100%'
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: 'var(--color-principal)' }}>
                    Registro
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Apellido"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.email}
                        helperText={errors.email}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Teléfono (opcional)"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.password}
                        helperText={
                            <Box>
                                {errors.password ? (
                                    <Typography variant="caption" color="error">
                                        {errors.password}
                                    </Typography>
                                ) : null}
                            </Box>
                        }
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <React.Fragment>
                                    <Tooltip 
                                        title={
                                            <Box>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Requisitos de contraseña:
                                                </Typography>
                                                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                                    {passwordRequirements.map((req, index) => (
                                                        <li key={index}>{req}</li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        }
                                        arrow
                                    >
                                        <Box 
                                            sx={{ 
                                                cursor: 'help',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#1565c0',
                                                }
                                            }}
                                        >
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    fontSize: '12px', 
                                                    fontWeight: 'bold',
                                                    lineHeight: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '100%'
                                                }}
                                            >
                                                i
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                </React.Fragment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={handleToggleConfirmPasswordVisibility}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: 'var(--color-principal)',
                            '&:hover': {
                                backgroundColor: 'var(--color-secundario)',
                            }
                        }}
                    >
                        Registrarse
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default React.memo(Register); 