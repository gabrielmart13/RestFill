using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Domain.Models
{
    public class Produto
    {
        [Key]
        public int IdProduto { get; set; }
        public string Nome { get; set; } = null!;
        public decimal CustoPorKg { get; set; }
        public DateTime Validade { get; set; }
        public decimal Quantidade { get; set; }
        public decimal QuantidadeMinima { get; set; }
        public string? Descricao { get; set; }

        public int IdCategoria { get; set; }
        public Categoria? Categoria { get; set; }

        public int IdUnidadeMedida { get; set; }
        public UnidadeMedida? UnidadeMedida { get; set; }

    }
}
