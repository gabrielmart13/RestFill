using System.ComponentModel.DataAnnotations;

namespace Restfill.API.Domain.Models
{
    public class UnidadeMedida
    {
        [Key]
        public int IdUnidadeMedida { get; set; }
        public string? Nome { get; set; }
        public string? Tipo { get; set; }

    }
}
