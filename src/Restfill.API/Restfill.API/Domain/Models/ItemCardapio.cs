using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Domain.Models
{
    public class ItemCardapio
    {
        [Key]
        public int IdItemCardapio { get; set; }
        public string DiaDaSemana { get; set; } = null!;
        public decimal QuantidadePrevista { get; set; }
        public string Periodo { get; set; } = null!;

        public int IdCardapio { get; set; }
        public Cardapio? Cardapio { get; set; }

        public int IdRefeicao { get; set; }
        public Refeicao? Refeicao { get; set; }
    }
}
