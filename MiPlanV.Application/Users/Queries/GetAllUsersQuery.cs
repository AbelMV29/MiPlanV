using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Queries;

public class GetAllUsersQuery : IRequest<IEnumerable<User>>
{
} 