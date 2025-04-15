using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Commands;

public class CreateUserCommand : IRequest<User>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
} 