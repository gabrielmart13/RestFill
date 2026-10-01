using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IProdutoService
    {
        public Task<Produto> PegarProduto(int id);
        public Task<List<Produto>> PegarTodosProdutos();
        public Task<Produto> CriarProduto(Produto produto);
        public Task<Produto> AtualizarProduto(int id, Produto produto);
        public Task<Produto> DeletarProduto(int id);
    }
}
