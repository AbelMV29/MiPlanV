using MediatR;
using MiPlanV.Application.Common.Dtos;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunches.Queries.GetAllPackedLunches
{
    public class GetAllPackedLunchsQuery : IRequest<PaginatedList<PackedLunch>>
    {
        public int page { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? Name { get; set; } = null;
        public bool? IsVegan { get; set; } = null;
        public bool? IsActive { get; set; } = null;
        public bool? IsCurrentCampaign { get; set; } = null;
    }
}