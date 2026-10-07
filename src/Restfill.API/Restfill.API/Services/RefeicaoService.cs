using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class RefeicaoService : IRefeicaoService
    {
        private readonly IGeralRepo _geralRepo;

        public RefeicaoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Refeicao> PegarRefeicao(int id)
        {
            var refeicao = await _geralRepo.Pegar<Refeicao>(id);

            if (refeicao == null)
            {
                throw new NotFoundException(
                    "Refeição não encontrada.");
            }

            return refeicao;
        }

        public async Task<List<Refeicao>> PegarTodasRefeicoes()
        {
            var refeicoes =
                await _geralRepo.PegarTodos<Refeicao>();

            return refeicoes.ToList();
        }

        public async Task<Refeicao> CriarRefeicao(Refeicao refeicao)
        {
            if (string.IsNullOrWhiteSpace(refeicao.Nome))
            {
                throw new ValidationException(
                    "É preciso informar o nome da refeição.");
            }

            await _geralRepo.Adicionar(refeicao);

            return refeicao;
        }

        public async Task<Refeicao> AtualizarRefeicao(
            int id,
            Refeicao refeicao)
        {
            var refeicaoAtual =
                await _geralRepo.Pegar<Refeicao>(id);

            if (refeicaoAtual == null)
            {
                throw new NotFoundException(
                    "Refeição não encontrada.");
            }

            if (string.IsNullOrWhiteSpace(refeicao.Nome))
            {
                throw new ValidationException(
                    "É preciso informar o nome da refeição.");
            }

            refeicaoAtual.Nome = refeicao.Nome;
            refeicaoAtual.Descricao = refeicao.Descricao;

            return await _geralRepo.Atualizar(refeicaoAtual);
        }

        public async Task<Refeicao> DeletarRefeicao(int id)
        {
            var refeicao =
                await _geralRepo.Pegar<Refeicao>(id);

            if (refeicao == null)
            {
                throw new NotFoundException(
                    "Refeição não encontrada.");
            }

            await _geralRepo.Remover(refeicao);

            return refeicao;
        }
    }
}