using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface ICardapioService
    {
        public Task<Cardapio> PegarCardapio(int id);
        public Task<List<Cardapio>> PegarTodosCardapios();
        public Task<Cardapio> AtualizarCardapio(Cardapio cardapio);
    }
}
