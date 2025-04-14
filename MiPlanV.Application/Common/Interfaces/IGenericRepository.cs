using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.Common.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> GetAllQuery();
        Task<T?> GetByIdAsync(int id);
        Task<T> AddAsync(T entity, CancellationToken token);
        Task<T> UpdateAsync(T entity, CancellationToken token);
        Task DeleteAsync(T entity, CancellationToken token);
    }
}
