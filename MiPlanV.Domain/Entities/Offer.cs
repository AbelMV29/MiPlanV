using MiPlanV.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiPlanV.Domain.Entities;

public class Offer : BaseEntity
{
    public int QuantityId { get; set; }
    [ForeignKey(nameof(QuantityId))]
    public virtual Quantity Quantity { get; set; }
    public decimal Price { get; set; }
    public int SizeId { get; set; }
    [ForeignKey(nameof(SizeId))]
    public virtual Size Size { get; set; }
    public virtual ICollection<OrderDetail> OrderDetails { get; set; }
}
