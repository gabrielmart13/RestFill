using Restfill.API.Domain.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IRefeicaoService
    {
        public Task<Refeicao> PegarRefeicao(int id);
        public Task<List<Refeicao>> PegarTodasRefeicoes();
        public Task<Refeicao> CriarRefeicao(Refeicao refeicao);
        public Task<Refeicao> AtualizarRefeicao(int id, Refeicao refeicao);
        public Task<Refeicao> DeletarRefeicao(int id);
    }
}
