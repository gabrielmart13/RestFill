using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restfill.API.Domain.Models
{
    public class Ingrediente
    {
        [Key]
        public int IdIngrediente { get; set; }
        public decimal Quantidade { get; set; }

        public int IdRefeicao { get; set; }
        public Refeicao? Refeicao { get; set; }

        public int IdProduto { get; set; }
        public Produto? Produto { get; set; }
    }
}
