using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiPlanV.Infrastructure.Repository.Common
{
    internal class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly IApplicationDbContext _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepository(IApplicationDbContext context )
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }
        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync(CancellationToken.None);//CancelToken Hardcodeado IMPLEMENTAR.
            return entity;
        }

        public async Task<bool> DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync(CancellationToken.None);
            return true; //HARDCODEADO  
        }

        public async Task<IEnumerable<T>> GetAllAsync()//Es buena forma de implementar el ToListAsync?
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);//Implementar AsNoTracking??
        }

        public async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync(CancellationToken.None);
            return entity;
        }
    }
}
