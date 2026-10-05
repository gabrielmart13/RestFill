namespace Restfill.API.Domain.DTOs.ItemCardapioDTO
{
    public class AtualizarItemCardapioRequest
    {
        public string DiaSemana { get; set; } = string.Empty;
        public int QuantidadePrevista { get; set; }
        public int IdCardapio { get; set; }
        public int IdRefeicao { get; set; }
        public string Periodo { get; set; } = string.Empty;
    }
}
