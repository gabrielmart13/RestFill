namespace Restfill.API.Domain.DTOs.IngredienteDTO
{
    public class AdicionarIngredienteRequest
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public int IdRefeicao { get; set; }
    }
}
