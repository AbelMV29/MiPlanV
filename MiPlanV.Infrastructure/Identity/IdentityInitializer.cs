using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Domain.Common.Constants;
using MiPlanV.Domain.Entities;
using MiPlanV.Infrastructure.Persistence;

namespace MiPlanV.Infrastructure.Identity;

public class IdentityInitializer
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly RoleManager<IdentityRole<int>> _roleManager;

    public IdentityInitializer(
        UserManager<User> userManager,
        ApplicationDbContext context,
        RoleManager<IdentityRole<int>> roleManager)
    {
        _userManager = userManager;
        _context = context;
        _roleManager = roleManager;
    }

    public async Task InitializeAsync()
    {
        await _context.Database.MigrateAsync();

        if (!await _roleManager.RoleExistsAsync(Roles.Admin))
            await _roleManager.CreateAsync(new IdentityRole<int>(Roles.Admin));

        if (!await _roleManager.RoleExistsAsync(Roles.User))
            await _roleManager.CreateAsync(new IdentityRole<int>(Roles.User));

        var adminEmail = "nataliajmoreira@gmail.com";
        var adminUser = await _userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                Name = "Admin User",
                EmailConfirmed = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, Roles.Admin);
            }
        }
    }
} 