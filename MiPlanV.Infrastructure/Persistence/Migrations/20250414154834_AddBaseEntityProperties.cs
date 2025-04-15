using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiPlanV.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddBaseEntityProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "AspNetUsers",
                newName: "Name");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Sizes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Quantities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Quantities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "PaymentMethods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "PackedLunches",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Orders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "OrderDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Offers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Campaigns",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Addresses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3674), true });

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3679), true });

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3683), true });

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3688), true });

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3694), true });

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3697), true });

            migrationBuilder.UpdateData(
                table: "Quantities",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "IsActive", "Name", "Value" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3579), true, "Individual", 0 });

            migrationBuilder.UpdateData(
                table: "Quantities",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "IsActive", "Name", "Value" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3584), true, "Pack 7", 0 });

            migrationBuilder.UpdateData(
                table: "Quantities",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "IsActive", "Name", "Value" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3587), true, "Pack 14", 0 });

            migrationBuilder.UpdateData(
                table: "Sizes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3015), true });

            migrationBuilder.UpdateData(
                table: "Sizes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[] { new DateTime(2025, 4, 14, 15, 48, 32, 554, DateTimeKind.Utc).AddTicks(3019), true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Sizes");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Quantities");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Quantities");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "PackedLunches");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "OrderDetails");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AspNetUsers",
                newName: "LastName");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6668));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6670));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6672));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6674));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6675));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6677));

            migrationBuilder.UpdateData(
                table: "Quantities",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Value" },
                values: new object[] { new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6616), 1 });

            migrationBuilder.UpdateData(
                table: "Quantities",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Value" },
                values: new object[] { new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6617), 7 });

            migrationBuilder.UpdateData(
                table: "Quantities",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Value" },
                values: new object[] { new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6618), 14 });

            migrationBuilder.UpdateData(
                table: "Sizes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6248));

            migrationBuilder.UpdateData(
                table: "Sizes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 11, 16, 11, 13, 417, DateTimeKind.Utc).AddTicks(6252));
        }
    }
}
