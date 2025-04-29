using MediatR;

namespace MiPlanV.Application.PackedLunches.Queries.GetCurrentsPackedLunchs
{
    public class GetCurrentsPackedLunchesQuery : IRequest<GetCurrentsPackedLunchesResponse[]>;
}
