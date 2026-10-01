using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IGerenteService
    {
        public Task<Gerente> PegarGerente(int id);
        public Task<List<Gerente>> PegarTodosGerentes();
        public Task<Gerente> AtualizarGerente(int id,Gerente gerente);
        public Task<Gerente> CriarGerente(Gerente gerente);
        public Task<Gerente> DeletarGerente(int id);
    }
}
