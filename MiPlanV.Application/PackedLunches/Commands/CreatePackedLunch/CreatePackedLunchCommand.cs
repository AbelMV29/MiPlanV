using MediatR;
using Microsoft.AspNetCore.Http;
using MiPlanV.Domain.Entities;
namespace MiPlanV.Application.PackedLunches.Commands.CreatePackedLunch
{
    public class CreatePackedLunchCommand : IRequest<PackedLunch>
    {
        public string Name { get; set; }
        public bool IsVegan { get; set; }
        public IFormFile? Image { get; set; } = null;
        public string? Description { get; set; } = null;
    }
}