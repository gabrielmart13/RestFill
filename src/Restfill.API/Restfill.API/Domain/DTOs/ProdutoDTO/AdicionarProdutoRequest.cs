namespace Restfill.API.Domain.DTOs.ProdutoDTO
{
    public class AdicionarProdutoRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal CustoPorKg { get; set; }
        public DateTime Validade { get; set; }
        public int Quantidade { get; set; }
        public int QuantidadeMinima { get; set; }
        public int IdCategoria { get; set; }
        public int IdUnidadeMedida { get; set; }

    }
}
