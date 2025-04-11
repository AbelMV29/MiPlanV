using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Domain.Entities;

namespace MiPlanV.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<PackedLunch> PackedLunches { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Quantity> Quantities { get; set; }
        public DbSet<Size> Sizes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            builder.Entity<Order>(entity =>
            {
                entity.HasOne(o => o.User)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(o => o.UserId);
                    // .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Campaign)
                    .WithMany(c => c.Orders)
                    .HasForeignKey(o => o.CampaignId);
                    // .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Address)
                    .WithMany()
                    .HasForeignKey(o => o.AddressId);
                    // .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.PaymentMethod)
                    .WithMany()
                    .HasForeignKey(o => o.PaymentMethodId);
                    // .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<OrderDetail>(entity =>
            {
                entity.HasOne(od => od.Order)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(od => od.OrderId);
                    // .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(od => od.PackedLunch)
                    .WithMany(pl => pl.OrderDetails)
                    .HasForeignKey(od => od.PackedLunchId);
                    // .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(od => od.Offer)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(od => od.OfferId);
                    // .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Offer>(entity =>
            {
                entity.HasOne(o => o.Quantity)
                    .WithMany()
                    .HasForeignKey(o => o.QuantityId);
                    // .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Size)
                    .WithMany()
                    .HasForeignKey(o => o.SizeId);
                    // .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 