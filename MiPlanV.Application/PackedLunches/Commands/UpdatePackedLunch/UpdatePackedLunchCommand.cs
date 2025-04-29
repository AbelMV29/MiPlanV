using MediatR;
using Microsoft.AspNetCore.Http;
using MiPlanV.Domain.Entities;
namespace MiPlanV.Application.PackedLunches.Commands.UpdatePackedLunch
{
    public class UpdatePackedLunchCommand : IRequest<PackedLunch>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsVegan { get; set; }
        public IFormFile? Image { get; set; } = null;
        public string? Description { get; set; } = null;
        public bool DeleteImage { get; set; } = false;
    }
}