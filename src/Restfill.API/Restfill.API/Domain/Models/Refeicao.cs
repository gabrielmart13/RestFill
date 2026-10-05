using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Refeicao
    {
        [Key]
        public int IdRefeicao { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
    }
}
