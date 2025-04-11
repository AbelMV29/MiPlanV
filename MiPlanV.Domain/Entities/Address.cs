using MiPlanV.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiPlanV.Domain.Entities;

public class Address : BaseEntity
{
    public int UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string CP { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int? Floor { get; set; }
}
