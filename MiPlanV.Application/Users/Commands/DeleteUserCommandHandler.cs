using MediatR;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Commands;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IGenericRepository<User> _userRepository;

    public DeleteUserCommandHandler(IGenericRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);
        if (user == null)
            return false;

        await _userRepository.DeleteAsync(user, cancellationToken);
        return true;
    }
} 