using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }
        public string Nome { get; set; } = null!;
        public string? Descricao { get; set; }
        public string? Icone { get; set; }
        public string? Cor { get; set; }
    }
}
