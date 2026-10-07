using Microsoft.EntityFrameworkCore;
using Restfill.API.Domain.Models;

namespace Restfill.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options) { }

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
            base.OnModelCreating(modelBuilder);

            // Tabelas
            modelBuilder.Entity<Gerente>()
                .ToTable("gerente");

            modelBuilder.Entity<Produto>()
                .ToTable("produto");

            modelBuilder.Entity<Categoria>()
                .ToTable("categoria");

            modelBuilder.Entity<UnidadeMedida>()
                .ToTable("unidademedida");

            modelBuilder.Entity<Movimentacao>()
                .ToTable("movimentacao");

            modelBuilder.Entity<Refeicao>()
                .ToTable("refeicao");

            modelBuilder.Entity<Ingrediente>()
                .ToTable("ingrediente");

            modelBuilder.Entity<Cardapio>()
                .ToTable("cardapio");

            modelBuilder.Entity<ItemCardapio>()
                .ToTable("itemcardapio");

            // Precisão dos valores monetários
            modelBuilder.Entity<Produto>()
                .Property(p => p.CustoPorKg)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Produto>()
                .Property(p => p.Quantidade)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Produto>()
                .Property(p => p.QuantidadeMinima)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Movimentacao>()
                .Property(m => m.Quantidade)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Movimentacao>()
                .Property(m => m.Custo)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Ingrediente>()
                .Property(i => i.Quantidade)
                .HasPrecision(10, 2);

            modelBuilder.Entity<ItemCardapio>()
                .Property(i => i.QuantidadePrevista)
                .HasPrecision(10, 2);

            // Cardápio começa ativo
            modelBuilder.Entity<Cardapio>()
                .Property(c => c.Ativo)
                .HasDefaultValue(true);

            // Ingrediente: mesma refeição não pode possuir
            // o mesmo produto duas vezes
            modelBuilder.Entity<Ingrediente>()
                .HasIndex(i => new
                {
                    i.IdRefeicao,
                    i.IdProduto
                })
                .IsUnique();

            // Relacionamentos
            modelBuilder.Entity<Produto>()
                .HasOne(p => p.Categoria)
                .WithMany()
                .HasForeignKey(p => p.IdCategoria)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Produto>()
                .HasOne(p => p.UnidadeMedida)
                .WithMany()
                .HasForeignKey(p => p.IdUnidadeMedida)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.Gerente)
                .WithMany()
                .HasForeignKey(m => m.IdGerente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.Produto)
                .WithMany()
                .HasForeignKey(m => m.IdProduto)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ingrediente>()
                .HasOne(i => i.Refeicao)
                .WithMany()
                .HasForeignKey(i => i.IdRefeicao)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ingrediente>()
                .HasOne(i => i.Produto)
                .WithMany()
                .HasForeignKey(i => i.IdProduto)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ItemCardapio>()
                .HasOne(i => i.Cardapio)
                .WithMany()
                .HasForeignKey(i => i.IdCardapio)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ItemCardapio>()
                .HasOne(i => i.Refeicao)
                .WithMany()
                .HasForeignKey(i => i.IdRefeicao)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}