namespace Restfill.API.Domain.DTOs.CategoriaDTO
{
    public class AtualizarCategoriaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty;
        public string Cor { get; set; } = string.Empty;
    }
}
