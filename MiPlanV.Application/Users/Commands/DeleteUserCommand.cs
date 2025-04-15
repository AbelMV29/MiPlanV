using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Commands;

public class DeleteUserCommand : IRequest<bool>
{
    public int Id { get; set; }
} 