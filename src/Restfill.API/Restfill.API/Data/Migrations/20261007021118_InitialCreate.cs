using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Restfill.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "cardapio",
                columns: table => new
                {
                    IdCardapio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: true),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cardapio", x => x.IdCardapio);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categoria",
                columns: table => new
                {
                    IdCategoria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: true),
                    Icone = table.Column<string>(type: "longtext", nullable: true),
                    Cor = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categoria", x => x.IdCategoria);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "gerente",
                columns: table => new
                {
                    IdGerente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Senha = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gerente", x => x.IdGerente);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "refeicao",
                columns: table => new
                {
                    IdRefeicao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refeicao", x => x.IdRefeicao);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "unidademedida",
                columns: table => new
                {
                    IdUnidadeMedida = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Tipo = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unidademedida", x => x.IdUnidadeMedida);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "itemcardapio",
                columns: table => new
                {
                    IdItemCardapio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DiaDaSemana = table.Column<string>(type: "longtext", nullable: false),
                    QuantidadePrevista = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Periodo = table.Column<string>(type: "longtext", nullable: false),
                    IdCardapio = table.Column<int>(type: "int", nullable: false),
                    IdRefeicao = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_itemcardapio", x => x.IdItemCardapio);
                    table.ForeignKey(
                        name: "FK_itemcardapio_cardapio_IdCardapio",
                        column: x => x.IdCardapio,
                        principalTable: "cardapio",
                        principalColumn: "IdCardapio",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_itemcardapio_refeicao_IdRefeicao",
                        column: x => x.IdRefeicao,
                        principalTable: "refeicao",
                        principalColumn: "IdRefeicao",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "produto",
                columns: table => new
                {
                    IdProduto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    CustoPorKg = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Validade = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Quantidade = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    QuantidadeMinima = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: true),
                    IdCategoria = table.Column<int>(type: "int", nullable: false),
                    IdUnidadeMedida = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produto", x => x.IdProduto);
                    table.ForeignKey(
                        name: "FK_produto_categoria_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "categoria",
                        principalColumn: "IdCategoria",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_produto_unidademedida_IdUnidadeMedida",
                        column: x => x.IdUnidadeMedida,
                        principalTable: "unidademedida",
                        principalColumn: "IdUnidadeMedida",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ingrediente",
                columns: table => new
                {
                    IdIngrediente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Quantidade = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    IdRefeicao = table.Column<int>(type: "int", nullable: false),
                    IdProduto = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ingrediente", x => x.IdIngrediente);
                    table.ForeignKey(
                        name: "FK_ingrediente_produto_IdProduto",
                        column: x => x.IdProduto,
                        principalTable: "produto",
                        principalColumn: "IdProduto",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ingrediente_refeicao_IdRefeicao",
                        column: x => x.IdRefeicao,
                        principalTable: "refeicao",
                        principalColumn: "IdRefeicao",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "movimentacao",
                columns: table => new
                {
                    IdMovimentacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Quantidade = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Tipo = table.Column<string>(type: "longtext", nullable: false),
                    Custo = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Data = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Observacao = table.Column<string>(type: "longtext", nullable: true),
                    IdGerente = table.Column<int>(type: "int", nullable: false),
                    IdProduto = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movimentacao", x => x.IdMovimentacao);
                    table.ForeignKey(
                        name: "FK_movimentacao_gerente_IdGerente",
                        column: x => x.IdGerente,
                        principalTable: "gerente",
                        principalColumn: "IdGerente",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_movimentacao_produto_IdProduto",
                        column: x => x.IdProduto,
                        principalTable: "produto",
                        principalColumn: "IdProduto",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ingrediente_IdProduto",
                table: "ingrediente",
                column: "IdProduto");

            migrationBuilder.CreateIndex(
                name: "IX_ingrediente_IdRefeicao_IdProduto",
                table: "ingrediente",
                columns: new[] { "IdRefeicao", "IdProduto" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_itemcardapio_IdCardapio",
                table: "itemcardapio",
                column: "IdCardapio");

            migrationBuilder.CreateIndex(
                name: "IX_itemcardapio_IdRefeicao",
                table: "itemcardapio",
                column: "IdRefeicao");

            migrationBuilder.CreateIndex(
                name: "IX_movimentacao_IdGerente",
                table: "movimentacao",
                column: "IdGerente");

            migrationBuilder.CreateIndex(
                name: "IX_movimentacao_IdProduto",
                table: "movimentacao",
                column: "IdProduto");

            migrationBuilder.CreateIndex(
                name: "IX_produto_IdCategoria",
                table: "produto",
                column: "IdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_produto_IdUnidadeMedida",
                table: "produto",
                column: "IdUnidadeMedida");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ingrediente");

            migrationBuilder.DropTable(
                name: "itemcardapio");

            migrationBuilder.DropTable(
                name: "movimentacao");

            migrationBuilder.DropTable(
                name: "cardapio");

            migrationBuilder.DropTable(
                name: "refeicao");

            migrationBuilder.DropTable(
                name: "gerente");

            migrationBuilder.DropTable(
                name: "produto");

            migrationBuilder.DropTable(
                name: "categoria");

            migrationBuilder.DropTable(
                name: "unidademedida");
        }
    }
}
