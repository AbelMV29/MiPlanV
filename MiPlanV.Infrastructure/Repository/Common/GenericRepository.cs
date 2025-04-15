using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Common;

namespace MiPlanV.Infrastructure.Repository.Common
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class, IBaseEntity
    {
        protected readonly IApplicationDbContext _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepository(IApplicationDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        /// <summary>
        /// Dentro del Iqueryable pueden utilzar AsNoTracking() en la 
        /// ejecucion de GetAllQuery para evitar el tracking de entidades
        /// By: Joneee feat.Abel
        /// </summary>
        /// <returns>Entidad como Query</returns>
        public IQueryable<T> GetAllQuery()
        {
            return _dbSet.AsQueryable();
        }

        public async Task<T?> GetByIdAsync(int id)//posible Eliminacion por el GetAllQuery, Polque? no hay polque.
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> AddAsync(T entity, CancellationToken token)
        {
            await _dbSet.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
            return entity;
        }

        public async Task<T> UpdateAsync(T entity, CancellationToken token)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync(token);
            return entity;
        }

        public async Task DeleteAsync(T entity, CancellationToken token)
        {
            entity.IsActive = false;
            _dbSet.Update(entity);
            await _context.SaveChangesAsync(token);
        }
    }
}
