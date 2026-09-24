using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Models
{
    public class ItemCardapio
    {
        [Key]
        public int IdItemCardapio { get; set; }
        public string? DiaDaSemana { get; set; }
        public decimal? QuantidadePrevista { get; set; }
        public string? Periodo { get; set; }
        public int? IdCardapio { get; set; }

        [ForeignKey(nameof(IdCardapio))]
        public Cardapio? Cardapio { get; set; }

        public int? IdRefeicao { get; set; }

        [ForeignKey(nameof(IdRefeicao))]
        public Refeicao? Refeicao { get; set; }
    }
}
