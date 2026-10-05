using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
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
                throw new ArgumentException("Produto não encontrado.");
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
            if (string.IsNullOrWhiteSpace(produto.Nome) || produto.CustoPorKg <= 0 || 
                produto.Quantidade <= 0 || produto.IdCategoria == null || 
                produto.IdUnidadeMedida == null || produto.Validade == null || 
                produto.IdCategoria == null)
            {
                throw new ArgumentException("É preciso informar todos os itens obrigatórios.");
            }
            await _geralRepo.Adicionar<Produto>(produto);
            return produto;
        }
        public async Task<Produto> AtualizarProduto(int id, Produto produto)
        {
            var produtoAtt = await _geralRepo.Pegar<Produto>(id);
            if(produtoAtt == null)
            {
                throw new ArgumentException("Produto não encontrado.");
            }
            if (string.IsNullOrWhiteSpace(produto.Nome) || produto.CustoPorKg <= 0 ||
                produto.Quantidade <= 0 || produto.IdCategoria == null ||
                produto.IdUnidadeMedida == null || produto.Validade == null ||
                produto.IdCategoria == null)
            {
                throw new ArgumentException("É preciso informar todos os itens obrigatórios.");
            }
            produtoAtt.Nome = produto.Nome;
            produtoAtt.CustoPorKg = produto.CustoPorKg;
            produtoAtt.Validade = produto.Validade;
            produtoAtt.Quantidade = produto.Quantidade;
            produtoAtt.QuantidadeMinima = produto.QuantidadeMinima;
            produtoAtt.Descricao = produto.Descricao;
            produtoAtt.IdCategoria = produto.IdCategoria;
            produtoAtt.IdUnidadeMedida = produto.IdUnidadeMedida;
            await _geralRepo.Atualizar<Produto>(produtoAtt);
            return produtoAtt;
        }
        public async Task<Produto> DeletarProduto(int id)
        {
            var produto = await _geralRepo.Pegar<Produto>(id);
            if (produto == null)
            {
                throw new ArgumentException("Produto não encontrado.");
            }
            await _geralRepo.Remover<Produto>(produto);
            return produto;
        }
    }
}
