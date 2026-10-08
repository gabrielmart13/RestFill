using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Domain.Models
{
    public class Movimentacao
    {
        [Key]
        public int IdMovimentacao { get; set; }
        public decimal Quantidade { get; set; }
        public string Tipo { get; set; } = null!;
        public decimal Custo { get; set; }
        public DateTime Data { get; set; }
        public string? Observacao { get; set; }

        public int IdGerente { get; set; }
        public Gerente? Gerente { get; set; }

        public int IdProduto { get; set; }
        public Produto? Produto { get; set; }
    }
}
