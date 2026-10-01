using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface ICategoriaService
    {
        public Task<Categoria> PegarCategoria(int id);
        public Task<List<Categoria>> PegarTodasCategorias();
        public Task<Categoria> AtualizarCategoria(int id,Categoria categoria);
        public Task<Categoria> CriarCategoria(Categoria categoria);
        public Task<Categoria> DeletarCategoria(int id);
    }
}
