namespace Restfill.API.Domain.DTOs.ItemCardapioDTO
{
    public class AdicionarItemCardapioRequest
    {
        public string DiaDaSemana { get; set; } = string.Empty;
        public decimal QuantidadePrevista { get; set; }
        public int IdCardapio { get; set; }
        public int IdRefeicao { get; set; }
        public string Periodo { get; set; } = string.Empty;
    }
}