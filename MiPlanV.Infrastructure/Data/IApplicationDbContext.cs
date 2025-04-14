using Microsoft.EntityFrameworkCore;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Infrastructure.Data
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Quantity> Quantities { get; set; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
} 