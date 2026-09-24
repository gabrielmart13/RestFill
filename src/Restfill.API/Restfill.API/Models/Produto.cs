using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Models
{
    public class Produto
    {
        [Key]
        public int IdProduto { get; set; }
        public string? Nome { get; set; }
        public decimal? CustoPorKg { get; set; }
        public DateTime? Validade { get; set; }
        public decimal? Quantidade { get; set; }
        public decimal? QuantidadeMinima { get; set; }
        public string? Descricao { get; set; }
        public int? IdCategoria { get; set; }

        [ForeignKey(nameof(IdCategoria))]
        public Categoria? Categoria { get; set; }

        public int? IdUnidadeMedida { get; set; }

        [ForeignKey(nameof(IdUnidadeMedida))]
        public UnidadeMedida? UnidadeMedida { get; set; }

    }
}
