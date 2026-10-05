using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Cardapio
    {
        [Key]
        public int IdCardapio { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public bool? Ativo { get; set; }
    }
}
