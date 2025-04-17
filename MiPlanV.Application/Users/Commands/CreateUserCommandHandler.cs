using MediatR;
using MiPlanV.Application.Users.Interfaces;
using MiPlanV.Domain.Entities;
using System;

namespace MiPlanV.Application.Users.Commands;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, User>
{
    private readonly IUserRepository _userRepository;

    public CreateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Verificar si el usuario ya existe
        var existingUser = await _userRepository.FindByEmailAsync(request.Email);
        
        if (existingUser != null)
        {
            // Si el usuario existe pero está desactivado, lo reactivamos
            if (!existingUser.IsActive)
            {
                existingUser.IsActive = true;
                await _userRepository.UpdateAsync(existingUser, cancellationToken);
                
                // Lanzar excepción personalizada para indicar que el usuario fue reactivado
                throw new UserReactivatedException(
                    "Tu cuenta ha sido reactivada. Por favor, inicia sesión. Si no recuerdas tu contraseña, utiliza la opción de recuperación."
                );
            }
            
            // Si el usuario ya existe y está activo, lanzar excepción
            throw new UserAlreadyExistsException(
                "Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza la opción de recuperación de contraseña."
            );
        }
        
        // Si el usuario no existe, lo creamos
        var user = new User
        {
            Name = $"{request.FirstName} {request.LastName}",
            UserName = request.Email,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber
        };

        return await _userRepository.AddAsync(user, request.Password);
    }
}

// Excepciones personalizadas
public class UserAlreadyExistsException : Exception
{
    public UserAlreadyExistsException(string message) : base(message) { }
}

public class UserReactivatedException : Exception
{
    public UserReactivatedException(string message) : base(message) { }
} 