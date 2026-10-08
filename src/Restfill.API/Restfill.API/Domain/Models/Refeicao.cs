using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Refeicao
    {
        [Key]
        public int IdRefeicao { get; set; }
        public string Nome { get; set; } = null!;
        public string? Descricao { get; set; }
    }
}
