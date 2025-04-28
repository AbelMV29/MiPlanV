using MediatR;
namespace MiPlanV.Application.PackedLunches.Commands.DeletePackedLunch
{
    public class DeletePackedLunchCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}