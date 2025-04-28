using MediatR;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunches.Queries.GetCurrentsPackedLunchs
{
    public class GetCurrentsPackedLunchesQueryHandler : IRequestHandler<GetCurrentsPackedLunchesQuery, GetCurrentsPackedLunchesResponse[]>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public GetCurrentsPackedLunchesQueryHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<GetCurrentsPackedLunchesResponse[]> Handle(GetCurrentsPackedLunchesQuery request, CancellationToken cancellationToken)
        {
            IQueryable<PackedLunch> packedLunchesQuery = _repository.GetAllQuery();

            packedLunchesQuery = packedLunchesQuery.Where(p => p.IsActive && p.IsCurrent);

            return await packedLunchesQuery.Select(p => new GetCurrentsPackedLunchesResponse(p.Id, p.Name, p.Description, p.Image, p.IsVegan)).ToArrayAsync();
        }
    }
}
