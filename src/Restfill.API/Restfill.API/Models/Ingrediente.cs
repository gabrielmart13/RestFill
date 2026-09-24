using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Models
{
    public class Ingrediente
    {
        [Key]
        public int IdIngrediente { get; set; }
        public decimal? Quantidade { get; set; }
        public int? IdRefeicao { get; set; }

        [ForeignKey(nameof(IdRefeicao))]
        public Refeicao? Refeicao { get; set; }
        public int? IdProduto { get; set; }

        [ForeignKey(nameof(IdProduto))]
        public Produto? Produto { get; set; }
    }
}
