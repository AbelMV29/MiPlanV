using Microsoft.AspNetCore.Identity;
using MiPlanV.Domain.Common;

namespace MiPlanV.Domain.Entities;

public class User : IdentityUser<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public virtual ICollection<Address> Addresses { get; set; }
    public virtual ICollection<Order> Orders { get; set; }
}
