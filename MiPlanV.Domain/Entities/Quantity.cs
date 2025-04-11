using MiPlanV.Domain.Common;

namespace MiPlanV.Domain.Entities;

public class Quantity : BaseEntity
{
    public int Value { get; set; } //1, 7, 14 y posiblidad de agregar más
}
