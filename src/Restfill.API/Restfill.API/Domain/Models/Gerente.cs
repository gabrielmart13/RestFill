using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class Gerente
    {
        [Key]
        public int IdGerente { get; set; }
        public string Nome { get; set; } = null!;
        public string Senha { get; set; } = null!;
    }
}
