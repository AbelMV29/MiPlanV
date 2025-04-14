using MediatR;
using MiPlanV.Application.Users.Interfaces;
using MiPlanV.Domain.Entities;

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
        var user = new User
        {
            Name = $"{request.FirstName} {request.LastName}",
            UserName = request.Email,
            Email = request.Email
        };

        return await _userRepository.AddAsync(user, request.Password);
    }
} 