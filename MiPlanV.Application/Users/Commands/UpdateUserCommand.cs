using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Commands;

public class UpdateUserCommand : IRequest<User>
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
} 