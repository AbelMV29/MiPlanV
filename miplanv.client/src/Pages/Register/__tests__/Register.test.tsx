import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../index';
import authService from '../../../services/auth.service';

jest.mock('../../../services/auth.service');
jest.mock('sweetalert2', () => ({
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('Register Component', () => {
    const fillForm = () => {
        fireEvent.change(screen.getByLabelText(/nombre/i), {
            target: { value: 'John' }
        });
        fireEvent.change(screen.getByLabelText(/apellido/i), {
            target: { value: 'Doe' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'john.doe@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'Password123!' }
        });
        fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
            target: { value: 'Password123!' }
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
    });

    it('should render the registration form', () => {
        expect(screen.getByText(/registro/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty form', async () => {
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
            expect(screen.getByText(/el apellido es requerido/i)).toBeInTheDocument();
            expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
            expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
        });
    });

    it('should show password validation errors', async () => {
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'weak' }
        });

        await waitFor(() => {
            expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument();
            expect(screen.getByText(/al menos una mayúscula/i)).toBeInTheDocument();
            expect(screen.getByText(/al menos una minúscula/i)).toBeInTheDocument();
            expect(screen.getByText(/al menos un número/i)).toBeInTheDocument();
            expect(screen.getByText(/al menos un carácter especial/i)).toBeInTheDocument();
        });
    });

    it('should successfully register a user', async () => {
        (authService.register as jest.Mock).mockResolvedValueOnce({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        });

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('should show error message when registration fails', async () => {
        const errorMessage = 'Email already exists';
        (authService.register as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
}); 