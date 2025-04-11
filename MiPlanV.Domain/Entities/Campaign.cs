using MiPlanV.Domain.Common;

namespace MiPlanV.Domain.Entities;

public class Campaign : BaseEntity
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual ICollection<Order> Orders { get; set; }
}
