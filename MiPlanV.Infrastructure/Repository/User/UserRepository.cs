using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Application.Users.Interfaces;
using MiPlanV.Domain.Entities;
using MiPlanV.Infrastructure.Repository.Common;

namespace MiPlanV.Infrastructure.Repository;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly UserManager<User> _userManager;

    public UserRepository(IApplicationDbContext context, UserManager<User> userManager) 
        : base(context)
    {
        _userManager = userManager;
    }

    public async Task<User> AddAsync(User user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Error al crear el usuario: {errors}");
        }

        return user;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Where(u => u.IsActive)
            .ToListAsync();
    }

    public async Task DeleteAsync(User user)
    {
        user.IsActive = false;
        await _userManager.UpdateAsync(user);
    }
}
