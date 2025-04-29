using MediatR;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;
namespace MiPlanV.Application.PackedLunches.Commands.UpdatePackedLunch
{
    public class UpdatePackedLunchCommandHandler : IRequestHandler<UpdatePackedLunchCommand, PackedLunch>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public UpdatePackedLunchCommandHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<PackedLunch> Handle(UpdatePackedLunchCommand request, CancellationToken cancellationToken)
        {
            PackedLunch? packedLunchToUpdate = await _repository.GetByIdAsync(request.Id);
            if(packedLunchToUpdate is null)
                throw new InvalidOperationException($"No se encontró la vianda con ID {request.Id}");

            string? newImage = null;
            if(!request.DeleteImage)
            {
                if (request.Image is not null)
                    newImage = await request.Image.ConvertFileToBase64(cancellationToken);
                else
                    newImage = packedLunchToUpdate.Image;
            }
            
            packedLunchToUpdate.Name = request.Name;
            packedLunchToUpdate.Description = request.Description;
            packedLunchToUpdate.IsVegan = request.IsVegan;
            packedLunchToUpdate.Image = newImage;

            await _repository.UpdateAsync(packedLunchToUpdate, cancellationToken);
            return packedLunchToUpdate;
        }
    }
}