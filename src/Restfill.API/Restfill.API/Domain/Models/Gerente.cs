using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Gerente
    {
        [Key]
        public int IdGerente { get; set; }

        public string? Nome { get; set; }

        public string? Senha { get; set; }
    }
}
