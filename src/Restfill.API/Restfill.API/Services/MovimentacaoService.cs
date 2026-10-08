using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class MovimentacaoService : IMovimentacaoService
    {
        private readonly IGeralRepo _geralRepo;

        public MovimentacaoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Movimentacao> AdicionarMovimentacao(
            Movimentacao movimentacao)
        {
            var produtos = await _geralRepo.PegarTodos<Produto>();

            if (movimentacao.Custo < 0 ||
                string.IsNullOrWhiteSpace(movimentacao.Tipo) ||
                movimentacao.Quantidade <= 0)
            {
                throw new ValidationException(
                    "Os dados da movimentação são inválidos.");
            }

            movimentacao.Tipo =
                movimentacao.Tipo.Trim().ToUpper();

            Produto? produtoEncontrado = null;

            foreach (Produto produto in produtos)
            {
                if (movimentacao.IdProduto == produto.IdProduto)
                {
                    produtoEncontrado = produto;

                    if (!produto.Ativo)
                    {
                        throw new ConflictException(
                            "Não é possível realizar uma movimentação em um produto desativado.");
                    }

                    if (movimentacao.Tipo == "ENTRADA")
                    {
                        produto.Quantidade += movimentacao.Quantidade;
                    }
                    else if (movimentacao.Tipo == "SAIDA")
                    {
                        if (movimentacao.Quantidade > produto.Quantidade)
                        {
                            throw new ConflictException(
                                $"Estoque insuficiente. Estoque atual: {produto.Quantidade}.");
                        }

                        produto.Quantidade -= movimentacao.Quantidade;
                    }
                    else
                    {
                        throw new ValidationException(
                            "O tipo da movimentação deve ser ENTRADA ou SAIDA.");
                    }

                    break;
                }
            }

            if (produtoEncontrado == null)
            {
                throw new NotFoundException(
                    "Produto não encontrado.");
            }

            await _geralRepo.Adicionar(movimentacao);

            await _geralRepo.Atualizar(produtoEncontrado);

            return movimentacao;
        }

        public async Task<Movimentacao> PegarMovimentacao(int id)
        {
            var movimentacao =
                await _geralRepo.Pegar<Movimentacao>(id);

            if (movimentacao == null)
            {
                throw new NotFoundException(
                    "Movimentação não encontrada.");
            }

            return movimentacao;
        }

        public async Task<List<Movimentacao>> PegarTodasMovimentacoes()
        {
            var movimentacoes =
                await _geralRepo.PegarTodos<Movimentacao>();

            return movimentacoes.ToList();
        }
    }
}