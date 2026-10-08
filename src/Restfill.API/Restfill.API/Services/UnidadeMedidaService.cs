using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class UnidadeMedidaService : IUnidadeMedidaService
    {
        private readonly IGeralRepo _geralRepo;

        public UnidadeMedidaService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<UnidadeMedida> PegarUnidadeMedida(int id)
        {
            var unidadeMedida =
                await _geralRepo.Pegar<UnidadeMedida>(id);

            if (unidadeMedida == null)
            {
                throw new NotFoundException(
                    "Unidade de medida não encontrada.");
            }

            return unidadeMedida;
        }

        public async Task<List<UnidadeMedida>> PegarTodasUnidadesMedida()
        {
            var unidadesMedida =
                await _geralRepo.PegarTodos<UnidadeMedida>();

            return unidadesMedida.ToList();
        }
    }
}