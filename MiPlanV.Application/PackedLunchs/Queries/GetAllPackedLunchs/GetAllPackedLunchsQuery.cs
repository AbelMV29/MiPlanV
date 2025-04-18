using FluentValidation;
using MediatR;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunchs.Queries.GetAllPackedLunchs
{
    public class GetAllPackedLunchsQuery : IRequest<IEnumerable<PackedLunch>>
    {
        public string? Name { get; set; } = null;
    }
}