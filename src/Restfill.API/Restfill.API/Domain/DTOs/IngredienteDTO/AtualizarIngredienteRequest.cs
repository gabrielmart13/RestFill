namespace Restfill.API.Domain.DTOs.IngredienteDTO
{
    public class AtualizarIngredienteRequest
    {
        public int IdProduto { get; set; }
        public decimal Quantidade { get; set; }
        public int IdRefeicao { get; set; }
    }
}