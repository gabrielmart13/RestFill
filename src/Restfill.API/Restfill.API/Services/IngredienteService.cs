using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class IngredienteService : IIngredienteService
    {
        private readonly IGeralRepo _geralrepo;
        public IngredienteService(IGeralRepo geralrepo) //Injeção de dependência do repositório
        {
            _geralrepo = geralrepo;
        }

        public async Task<Ingrediente> AdicionarIngrediente(Ingrediente ingrediente)
        {
            if(ingrediente.IdProduto == null || ingrediente.IdRefeicao == null || ingrediente.Quantidade <= 0)
            {
                throw new Exception("IdProduto e IdRefeicao são obrigatórios e Quantidade deve ser positiva.");
            }
            await _geralrepo.Adicionar(ingrediente);
            return ingrediente;
        }

        public async Task<Ingrediente> AtualizarIngrediente(int id, Ingrediente ingrediente)
        {
            var ingredienteAtt = await _geralrepo.Pegar<Ingrediente>(id);
            if (ingredienteAtt == null)
            {
                throw new ArgumentException("Ingrediente não encontrado.");
            }
            if (ingrediente.IdProduto == null || ingrediente.IdRefeicao == null || ingrediente.Quantidade <= 0)
            {
                throw new Exception("IdProduto e IdRefeicao são obrigatórios e Quantidade deve ser positiva.");
            }
            ingredienteAtt.Quantidade = ingrediente.Quantidade;
            ingredienteAtt.IdProduto = ingrediente.IdProduto;
            ingredienteAtt.IdRefeicao = ingrediente.IdRefeicao;
            

            await _geralrepo.Atualizar(ingredienteAtt);
            return ingrediente;
        }

        public async Task<Ingrediente> DeletarIngrediente(int id)
        {
            var ingrediente = await _geralrepo.Pegar<Ingrediente>(id);
            if (ingrediente == null)
            {
                throw new Exception("Ingrediente não encontrado.");
            }
            await _geralrepo.Remover(ingrediente);
            return ingrediente;
        }
        

        public async Task<Ingrediente> PegarIngrediente(int id)
        {
            var ingrediente = await _geralrepo.Pegar<Ingrediente>(id);
            if (ingrediente == null)
            {
                throw new Exception("Ingrediente não encontrado.");
            }
            return ingrediente;
        }

        public async Task<List<Ingrediente>> PegarTodosIngredientes()
        {
            var ingredientes = await _geralrepo.PegarTodos<Ingrediente>();
            return ingredientes.ToList();
        }
    }
}
