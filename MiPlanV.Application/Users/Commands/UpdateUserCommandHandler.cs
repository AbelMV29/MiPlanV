using MediatR;
using MiPlanV.Application.Users.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Commands;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, User>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);
        if (user == null)
            throw new InvalidOperationException($"Usuario con ID {request.Id} no encontrado");

        user.Name = $"{request.FirstName} {request.LastName}";
        user.Email = request.Email;
        user.UserName = request.Email;

        return await _userRepository.UpdateAsync(user, cancellationToken);
    }
} 