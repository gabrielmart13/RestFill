using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Models
{
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Icone { get; set; }
        public string? Cor { get; set; }
    }
}
