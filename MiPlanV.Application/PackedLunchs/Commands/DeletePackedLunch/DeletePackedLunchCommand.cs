using MediatR;
namespace MiPlanV.Application.PackedLunchs.Commands.DeletePackedLunch
{
    public class DeletePackedLunchCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}