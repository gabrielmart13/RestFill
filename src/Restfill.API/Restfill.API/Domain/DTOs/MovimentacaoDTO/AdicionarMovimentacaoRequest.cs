namespace Restfill.API.Domain.DTOs.MovimentacaoDTO
{
    public class AdicionarMovimentacaoRequest
    {
        public int IdProduto { get; set; }
        public decimal Quantidade { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public string? Observacao { get; set; }
        public int IdGerente { get; set; }
        public decimal Custo { get; set; }
    }
}