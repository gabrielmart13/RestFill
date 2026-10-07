using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Cardapio
    {
        [Key]
        public int IdCardapio { get; set; }
        public string Nome { get; set; } = null!;
        public string? Descricao { get; set; }
        public bool Ativo { get; set; }
    }
}
