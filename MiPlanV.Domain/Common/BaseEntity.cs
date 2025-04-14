using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiPlanV.Domain.Common;

public interface IBaseEntity
{
    int Id { get; set; }
    bool IsActive { get; set; }
    DateTime CreatedAt { get; set; }
}

public abstract class BaseEntity : IBaseEntity
{
    [Key]
    public int Id { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Name { get; set; } = string.Empty;
} 