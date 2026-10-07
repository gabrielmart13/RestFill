using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IGeralRepo _geralRepo;

        public ProdutoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Produto> PegarProduto(int id)
        {
            var produto = await _geralRepo.Pegar<Produto>(id);

            if (produto == null)
            {
                throw new NotFoundException(
                    "Produto não encontrado.");
            }

            return produto;
        }

        public async Task<List<Produto>> PegarTodosProdutos()
        {
            var produtos = await _geralRepo.PegarTodos<Produto>();

            return produtos.ToList();
        }

        public async Task<Produto> CriarProduto(Produto produto)
        {
            if (string.IsNullOrWhiteSpace(produto.Nome) ||
                produto.CustoPorKg <= 0 ||
                produto.Quantidade <= 0 ||
                produto.IdCategoria == null ||
                produto.IdUnidadeMedida == null ||
                produto.Validade == null)
            {
                throw new ValidationException(
                    "É preciso informar todos os campos obrigatórios.");
            }

            await _geralRepo.Adicionar(produto);

            return produto;
        }

        public async Task<Produto> AtualizarProduto(
            int id,
            Produto produto)
        {
            var produtoAtual =
                await _geralRepo.Pegar<Produto>(id);

            if (produtoAtual == null)
            {
                throw new NotFoundException(
                    "Produto não encontrado.");
            }

            if (string.IsNullOrWhiteSpace(produto.Nome) ||
                produto.CustoPorKg <= 0 ||
                produto.Quantidade <= 0 ||
                produto.IdCategoria == null ||
                produto.IdUnidadeMedida == null ||
                produto.Validade == null)
            {
                throw new ValidationException(
                    "É preciso informar todos os campos obrigatórios.");
            }

            produtoAtual.Nome = produto.Nome;
            produtoAtual.CustoPorKg = produto.CustoPorKg;
            produtoAtual.Validade = produto.Validade;
            produtoAtual.Quantidade = produto.Quantidade;
            produtoAtual.QuantidadeMinima = produto.QuantidadeMinima;
            produtoAtual.Descricao = produto.Descricao;
            produtoAtual.IdCategoria = produto.IdCategoria;
            produtoAtual.IdUnidadeMedida = produto.IdUnidadeMedida;

            return await _geralRepo.Atualizar(produtoAtual);
        }

        public async Task<Produto> DeletarProduto(int id)
        {
            var produto =
                await _geralRepo.Pegar<Produto>(id);

            if (produto == null)
            {
                throw new NotFoundException(
                    "Produto não encontrado.");
            }

            await _geralRepo.Remover(produto);

            return produto;
        }
    }
}