using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Models
{
    public class Movimentacao
    {
        [Key]
        public int IdMovimentacao { get; set; }
        public decimal? Quantidade { get; set; }
        public string? Tipo { get; set; }
        public decimal? Custo { get; set; }
        public DateTime? Data { get; set; }
        public string? Observacao { get; set; }
        public int? IdGerente { get;set; }

        [ForeignKey(nameof(IdGerente))]
        public Gerente? Gerente { get; set; }
        public int? IdProduto { get; set; }

        [ForeignKey(nameof(IdProduto))]
        public Produto? Produto { get; set; }
    }
}
