using MiPlanV.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiPlanV.Domain.Entities;

public class Order : BaseEntity
{
    public int UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }
    public int CampaignId { get; set; }
    [ForeignKey(nameof(CampaignId))]
    public Campaign Campaign { get; set; }
    public int AddressId { get; set; }
    [ForeignKey(nameof(AddressId))]
    public virtual Address Address { get; set; }
    public int PaymentMethodId { get; set; }
    [ForeignKey(nameof(PaymentMethodId))]
    public virtual PaymentMethod PaymentMethod { get; set; }
    public decimal Mount { get; set; }
    public string Observation { get; set; } = string.Empty;
    public bool Delivery { get; set; }
    public virtual ICollection<OrderDetail> OrderDetails { get; set; }
}
