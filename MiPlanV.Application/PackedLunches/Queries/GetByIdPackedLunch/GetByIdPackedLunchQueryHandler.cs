using MediatR;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Application.PackedLunches.Queries.GetByIdPacketLunch
{
    public class GetByIdPackedLunchQueryHandler : IRequestHandler<GetByIdPackedLunchQuery, PackedLunch>
    {
        private readonly IGenericRepository<PackedLunch> _repository;

        public GetByIdPackedLunchQueryHandler(IGenericRepository<PackedLunch> repository)
        {
            _repository = repository;
        }

        public async Task<PackedLunch> Handle(GetByIdPackedLunchQuery request, CancellationToken cancellationToken)
        {
            PackedLunch? packedLunchFound = await _repository.GetByIdAsync(request.Id);
            if (packedLunchFound is null)
                throw new InvalidOperationException($"Vianda con ID {request.Id} no encontrado");

            return packedLunchFound;
        }
    }
}