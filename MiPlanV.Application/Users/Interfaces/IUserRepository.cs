using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Users.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User> AddAsync(User user, string password);
    Task<IEnumerable<User>> GetAllAsync();
    Task DeleteAsync(User user);
    Task<User> FindByEmailAsync(string email);
}
