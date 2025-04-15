using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Queries;

public class GetUserByIdQuery : IRequest<User>
{
    public int Id { get; set; }
} 