using MediatR;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Dtos;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunches.Queries.GetAllPackedLunches
{
    public class GetAllPackedLunchesQueryHandler : IRequestHandler<GetAllPackedLunchsQuery, PaginatedList<PackedLunch>>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public GetAllPackedLunchesQueryHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<PaginatedList<PackedLunch>> Handle(GetAllPackedLunchsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<PackedLunch> packedLunchesQuery = _repository.GetAllQuery();
            if (request.IsActive is not null)
            {
                packedLunchesQuery = packedLunchesQuery
                .Where(x => x.IsActive == request.IsActive);
            }
            if (!string.IsNullOrEmpty(request.Name))
            {
                packedLunchesQuery = packedLunchesQuery
                .Where(x => x.Name.ToLower().Contains(request.Name.ToLower()));
            }
            if (request.IsVegan is not null)
            {
                packedLunchesQuery = packedLunchesQuery
                .Where(x => x.IsVegan == request.IsVegan);
            }
            if (request.IsCurrentCampaign is not null)
            {
                packedLunchesQuery = packedLunchesQuery
                .Where(x => x.IsCurrent == request.IsCurrentCampaign);
            }

            PackedLunch[] packedLunches = await packedLunchesQuery.Skip((request.page) * request.pageSize)
                .Take(request.pageSize).ToArrayAsync();
            return new PaginatedList<PackedLunch>(packedLunches, packedLunchesQuery.Count(), request.page, packedLunchesQuery.Count());
        }
    }
}