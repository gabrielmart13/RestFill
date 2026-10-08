using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class IngredienteService : IIngredienteService
    {
        private readonly IGeralRepo _geralRepo;

        public IngredienteService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Ingrediente> AdicionarIngrediente(
            Ingrediente ingrediente)
        {
            if (ingrediente.IdProduto == null ||
                ingrediente.IdRefeicao == null ||
                ingrediente.Quantidade <= 0)
            {
                throw new ValidationException(
                    "IdProduto e IdRefeicao são obrigatórios e a quantidade deve ser positiva.");
            }

            await _geralRepo.Adicionar(ingrediente);

            return ingrediente;
        }

        public async Task<Ingrediente> AtualizarIngrediente(
            int id,
            Ingrediente ingrediente)
        {
            var ingredienteAtual =
                await _geralRepo.Pegar<Ingrediente>(id);

            if (ingredienteAtual == null)
            {
                throw new NotFoundException(
                    "Ingrediente não encontrado.");
            }

            if (ingrediente.IdProduto == null ||
                ingrediente.IdRefeicao == null ||
                ingrediente.Quantidade <= 0)
            {
                throw new ValidationException(
                    "IdProduto e IdRefeicao são obrigatórios e a quantidade deve ser positiva.");
            }

            ingredienteAtual.Quantidade = ingrediente.Quantidade;
            ingredienteAtual.IdProduto = ingrediente.IdProduto;
            ingredienteAtual.IdRefeicao = ingrediente.IdRefeicao;

            return await _geralRepo.Atualizar(ingredienteAtual);
        }

        public async Task<Ingrediente> DeletarIngrediente(int id)
        {
            var ingrediente =
                await _geralRepo.Pegar<Ingrediente>(id);

            if (ingrediente == null)
            {
                throw new NotFoundException(
                    "Ingrediente não encontrado.");
            }

            await _geralRepo.Remover(ingrediente);

            return ingrediente;
        }

        public async Task<Ingrediente> PegarIngrediente(int id)
        {
            var ingrediente =
                await _geralRepo.Pegar<Ingrediente>(id);

            if (ingrediente == null)
            {
                throw new NotFoundException(
                    "Ingrediente não encontrado.");
            }

            return ingrediente;
        }

        public async Task<List<Ingrediente>> PegarTodosIngredientes()
        {
            var ingredientes =
                await _geralRepo.PegarTodos<Ingrediente>();

            return ingredientes.ToList();
        }
    }
}