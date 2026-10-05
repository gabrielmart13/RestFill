using Restfill.API.Domain.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IItemCardapioService
    {
        public Task<ItemCardapio> PegarItemCardapio(int id);
        public Task<List<ItemCardapio>> PegarTodosItensCardapio();
        public Task<ItemCardapio> AdicionarItemCardapio(ItemCardapio itemCardapio);
        public Task<ItemCardapio> AtualizarItemCardapio(int id,ItemCardapio itemCardapio);
        public Task<ItemCardapio> DeletarItemCardapio(int id);
    }
}
