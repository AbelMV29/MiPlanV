using MediatR;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;
namespace MiPlanV.Application.PackedLunches.Commands.CreatePackedLunch
{
    public class CreatePackedLunchCommandHandler : IRequestHandler<CreatePackedLunchCommand, PackedLunch>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public CreatePackedLunchCommandHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<PackedLunch> Handle(CreatePackedLunchCommand request, CancellationToken cancellationToken)
        {
            string? image = null;
            if(request.Image is not null)
                image = await request.Image.ConvertFileToBase64(cancellationToken);
            //IsActive y CreatedAt ya se definen al crear el objeto.
            PackedLunch packedLunchToCreate = new PackedLunch {
                Name = request.Name,
                Description = request.Description,
                IsVegan = request.IsVegan,
                IsCurrent = false,
                Image = image
            };

            return await _repository.AddAsync(packedLunchToCreate, cancellationToken);;
        }
    }  
}