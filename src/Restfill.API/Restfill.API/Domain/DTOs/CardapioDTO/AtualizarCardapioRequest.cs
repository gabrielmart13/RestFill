namespace Restfill.API.Domain.DTOs.CardapioDTO
{
    public class AtualizarCardapioRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public bool Ativo { get; set; }
    }
}