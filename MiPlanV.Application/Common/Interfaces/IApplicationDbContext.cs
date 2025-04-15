using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Quantity> Quantities { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        Task SaveChangesAsync();
        DbSet<T> Set<T>() where T : class;
    }
} 