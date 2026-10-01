using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IMovimentacaoService
    {
        public Task<Movimentacao> PegarMovimentacao(int id);
        public Task<List<Movimentacao>> PegarTodasMovimentacoes();
        public Task<Movimentacao> AdicionarMovimentacao(Movimentacao movimentacao);

    }
}
