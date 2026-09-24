using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Models
{
    public class Refeicao
    {
        [Key]
        public int IdRefeicao { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
    }
}
