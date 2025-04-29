using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunches.Queries.GetByIdPacketLunch
{
    public class GetByIdPackedLunchQuery : IRequest<PackedLunch>
    {
        public int Id { get; set; }
    }
}