using MiPlanV.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiPlanV.Domain.Entities;

public class OrderDetail : BaseEntity
{
    public int PackedLunchId { get; set; }
    [ForeignKey(nameof(PackedLunchId))]
    public virtual PackedLunch PackedLunch { get; set; }
    public int OrderId { get; set; }
    [ForeignKey(nameof(OrderId))]
    public virtual Order Order { get; set; }
    public int OfferId { get; set; }
    [ForeignKey(nameof(OfferId))]
    public Offer Offer { get; set; }
    public decimal SubTotal { get; set; }
    public int Quantity { get; set; }
}