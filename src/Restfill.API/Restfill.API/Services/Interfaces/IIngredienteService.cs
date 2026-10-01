using Restfill.API.Models;

namespace Restfill.API.Services.Interfaces
{
    public interface IIngredienteService
    {
        public Task<Ingrediente> PegarIngrediente(int id);
        public Task<List<Ingrediente>> PegarTodosIngredientes();
        public Task<Ingrediente> AdicionarIngrediente(Ingrediente ingrediente);
        public Task<Ingrediente> AtualizarIngrediente(int id, Ingrediente ingrediente);
        public Task<Ingrediente> DeletarIngrediente(int id);
    }
}
