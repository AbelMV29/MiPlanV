using Microsoft.AspNetCore.Identity;
using MiPlanV.Domain.Common;

namespace MiPlanV.Domain.Entities;

public class User : IdentityUser<int>, IBaseEntity
{
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<Address> Addresses { get; set; }
    public virtual ICollection<Order> Orders { get; set; }
}
