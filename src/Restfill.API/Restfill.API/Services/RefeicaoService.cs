using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
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
                throw new ArgumentException("Refeição não encontrada.");
            }
            return refeicao;
        }

        public async Task<List<Refeicao>> PegarTodasRefeicoes()
        {
            var refeicoes = await _geralRepo.PegarTodos<Refeicao>();
            return refeicoes.ToList();
        }

        public async Task<Refeicao> CriarRefeicao(Refeicao refeicao)
        {
            if (string.IsNullOrWhiteSpace(refeicao.Nome))
            {
                throw new ArgumentException("É preciso informar o nome da refeição.");
            }
            await _geralRepo.Adicionar<Refeicao>(refeicao);
            return refeicao;
        }
        public async Task<Refeicao> AtualizarRefeicao(int id, Refeicao refeicao)
        {
            var refeicaoAtt = await _geralRepo.Pegar<Refeicao>(id);
            if (refeicaoAtt == null)
            {
                throw new ArgumentException("Refeição não encontrada.");
            }
            if (string.IsNullOrWhiteSpace(refeicao.Nome))
            {
                throw new ArgumentException("É preciso informar o nome da refeição.");
            }
            refeicaoAtt.Nome = refeicao.Nome;
            refeicaoAtt.Descricao = refeicao.Descricao;
            await _geralRepo.Atualizar<Refeicao>(refeicaoAtt);
            return refeicaoAtt;
        }
        public async Task<Refeicao> DeletarRefeicao(int id)
        {
            var refeicao = await _geralRepo.Pegar<Refeicao>(id);
            if (refeicao == null)
            {
                throw new ArgumentException("Refeição não encontrada.");
            }
            await _geralRepo.Remover<Refeicao>(refeicao);
            return refeicao;
        }

    }
}
