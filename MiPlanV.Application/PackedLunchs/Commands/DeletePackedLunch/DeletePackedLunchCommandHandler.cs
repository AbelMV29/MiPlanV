using MediatR;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;
namespace MiPlanV.Application.PackedLunchs.Commands.DeletePackedLunch
{
    public class DeletePackedLunchCommandHandler : IRequestHandler<DeletePackedLunchCommand, bool>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public DeletePackedLunchCommandHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(DeletePackedLunchCommand request, CancellationToken cancellationToken)
        {
            PackedLunch? packedLunchToDelete = await _repository.GetByIdAsync(request.Id);
            if (packedLunchToDelete is null)
            {
                return false;
            }
            await _repository.DeleteAsync(packedLunchToDelete, cancellationToken);
            return true;
        }
    }
}