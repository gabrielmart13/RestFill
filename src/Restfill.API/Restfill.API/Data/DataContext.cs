using Microsoft.EntityFrameworkCore;
using Restfill.API.Domain.Models;

namespace Restfill.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Gerente> Gerentes { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<UnidadeMedida> UnidadesMedida { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<Refeicao> Refeicoes { get; set; }
        public DbSet<Ingrediente> Ingredientes { get; set; }
        public DbSet<Cardapio> Cardapios { get; set; }
        public DbSet<ItemCardapio> ItensCardapio { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>()
                .ToTable("produto");

            modelBuilder.Entity<Gerente>()
                .ToTable("gerente");

            modelBuilder.Entity<Categoria>()
                .ToTable("categoria");

            modelBuilder.Entity<Cardapio>()
                .ToTable("cardapio");

            modelBuilder.Entity<Ingrediente>()
                .ToTable("ingrediente");

            modelBuilder.Entity<ItemCardapio>()
                .ToTable("itemcardapio");

            modelBuilder.Entity<Movimentacao>()
                .ToTable("movimentacao");

            modelBuilder.Entity<Refeicao>()
                .ToTable("refeicao");

            modelBuilder.Entity<UnidadeMedida>()
                .ToTable("unidademedida");
        }
    }
}
