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
            if (movimentacao.Custo < 0 ||
                movimentacao.Data == null ||
                string.IsNullOrWhiteSpace(movimentacao.Tipo) ||
                movimentacao.Quantidade <= 0 ||
                movimentacao.IdGerente == null ||
                movimentacao.IdProduto == null)
            {
                throw new ValidationException(
                    "Os dados da movimentação são inválidos.");
            }

            await _geralRepo.Adicionar(movimentacao);

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