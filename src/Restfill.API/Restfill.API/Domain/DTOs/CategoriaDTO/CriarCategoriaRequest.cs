namespace Restfill.API.Domain.DTOs.CategoriaDTO
{
    public class CriarCategoriaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Icone { get; set; }
        public string? Cor { get; set; }
    }
}