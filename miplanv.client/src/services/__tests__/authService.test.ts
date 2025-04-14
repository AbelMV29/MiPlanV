import { authService } from '../authService';
import { api } from '../api';
import { UserRegister, UserResponse } from '../../models/User';

jest.mock('../api');

describe('authService', () => {
    const mockUser: UserRegister = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!'
    };

    const mockResponse: UserResponse = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a user successfully', async () => {
            // Arrange
            (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

            // Act
            const result = await authService.register(mockUser);

            // Assert
            expect(api.post).toHaveBeenCalledWith('/users/register', mockUser);
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error with server message when registration fails', async () => {
            // Arrange
            const errorMessage = 'Email already exists';
            (api.post as jest.Mock).mockRejectedValueOnce({
                response: {
                    data: { error: errorMessage }
                }
            });

            // Act & Assert
            await expect(authService.register(mockUser)).rejects.toThrow(errorMessage);
        });

        it('should throw a generic error when no server message is available', async () => {
            // Arrange
            (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            // Act & Assert
            await expect(authService.register(mockUser)).rejects.toThrow('Error al registrar el usuario');
        });
    });
}); 