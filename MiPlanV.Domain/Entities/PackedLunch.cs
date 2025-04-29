using MiPlanV.Domain.Common;

namespace MiPlanV.Domain.Entities;

public class PackedLunch : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public bool IsVegan { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
    public virtual ICollection<OrderDetail> OrderDetails { get; set; }
}
