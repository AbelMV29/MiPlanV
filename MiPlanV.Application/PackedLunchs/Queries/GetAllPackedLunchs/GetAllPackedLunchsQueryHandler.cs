using MediatR;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunchs.Queries.GetAllPackedLunchs
{
    public class GetAllPackedLunchsQueryHandler : IRequestHandler<GetAllPackedLunchsQuery, IEnumerable<PackedLunch>>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public GetAllPackedLunchsQueryHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PackedLunch>> Handle(GetAllPackedLunchsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<PackedLunch> packedLunchesQuery = _repository.GetAllQuery();

            if (!string.IsNullOrEmpty(request.Name))
            {
                packedLunchesQuery = packedLunchesQuery
                .Where(x => x.Name.ToLower().Contains(request.Name.ToLower()));
            }

            return await packedLunchesQuery.ToArrayAsync();
        }
    }
}