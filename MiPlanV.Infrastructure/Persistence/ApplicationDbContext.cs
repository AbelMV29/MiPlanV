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
                    .HasForeignKey(o => o.UserId)
                     .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Campaign)
                    .WithMany(c => c.Orders)
                    .HasForeignKey(o => o.CampaignId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Address)
                    .WithMany()
                    .HasForeignKey(o => o.AddressId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.PaymentMethod)
                    .WithMany()
                    .HasForeignKey(o => o.PaymentMethodId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<OrderDetail>(entity =>
            {
                entity.HasOne(od => od.Order)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(od => od.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(od => od.PackedLunch)
                    .WithMany(pl => pl.OrderDetails)
                    .HasForeignKey(od => od.PackedLunchId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(od => od.Offer)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(od => od.OfferId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Size>(entity =>
            {
                entity.HasData(new Size
                {
                    Id = 1,
                    Name = "Standar",
                    CreatedAt = DateTime.UtcNow
                },
                new Size
                {
                    Id = 2,
                    Name = "Grande",
                    CreatedAt = DateTime.UtcNow
                });
            });

            builder.Entity<Quantity>(entity =>
            {
                entity.HasData(new Quantity
                {
                    Id = 1,
                    Value = 1,
                    CreatedAt = DateTime.UtcNow
                }, new Quantity
                {
                    Id = 2,
                    Value = 7,
                    CreatedAt = DateTime.UtcNow
                }, new Quantity
                {
                    Id = 3,
                    Value = 14,
                    CreatedAt = DateTime.UtcNow
                });
            });

            builder.Entity<Offer>(entity =>
            {
                entity.HasData(
                    // Viandas Standard
                    new Offer
                    {
                        Id = 1,
                        QuantityId = 1, // Individual
                        SizeId = 1, // Standard
                        Price = 7400,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Offer
                    {
                        Id = 2,
                        QuantityId = 2, // Pack 7
                        SizeId = 1, // Standard
                        Price = 50000,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Offer
                    {
                        Id = 3,
                        QuantityId = 3, // Pack 14
                        SizeId = 1, // Standard
                        Price = 98000,
                        CreatedAt = DateTime.UtcNow
                    },
                    // Viandas Grande
                    new Offer
                    {
                        Id = 4,
                        QuantityId = 1, // Individual
                        SizeId = 2, // Grande
                        Price = 8500,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Offer
                    {
                        Id = 5,
                        QuantityId = 2, // Pack 7
                        SizeId = 2, // Grande
                        Price = 59000,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Offer
                    {
                        Id = 6,
                        QuantityId = 3, // Pack 14
                        SizeId = 2, // Grande
                        Price = 117000,
                        CreatedAt = DateTime.UtcNow
                    }
                );
                
                entity.HasOne(o => o.Quantity)
                    .WithMany()
                    .HasForeignKey(o => o.QuantityId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Size)
                    .WithMany()
                    .HasForeignKey(o => o.SizeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 