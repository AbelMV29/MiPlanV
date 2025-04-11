using MiPlanV.Domain.Common;

namespace MiPlanV.Domain.Entities;

public class PaymentMethod : BaseEntity
{
    public string Name { get; set; } = string.Empty;
}
