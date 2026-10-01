using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IUnidadeMedidaService
    {
        public Task<UnidadeMedida> PegarUnidadeMedida(int id);
        public Task<List<UnidadeMedida>> PegarTodasUnidadesMedida();
    }
}
