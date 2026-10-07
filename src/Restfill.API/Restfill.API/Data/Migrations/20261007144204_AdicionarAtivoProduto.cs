using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restfill.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarAtivoProduto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "produto",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "produto");
        }
    }
}
