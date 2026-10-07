using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class CardapioService : ICardapioService
    {
        private readonly IGeralRepo _geralRepo;

        public CardapioService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Cardapio> AtualizarCardapio(
            int id,
            Cardapio cardapio)
        {
            var cardapioAtual =
                await _geralRepo.Pegar<Cardapio>(id);

            if (cardapioAtual == null)
            {
                throw new NotFoundException(
                    "Cardápio não encontrado.");
            }

            if (string.IsNullOrWhiteSpace(cardapio.Nome) ||
                string.IsNullOrWhiteSpace(cardapio.Descricao))
            {
                throw new ValidationException(
                    "Nome e descrição são obrigatórios.");
            }

            cardapioAtual.Nome = cardapio.Nome;
            cardapioAtual.Descricao = cardapio.Descricao;
            cardapioAtual.Ativo = cardapio.Ativo;

            return await _geralRepo.Atualizar(cardapioAtual);
        }

        public async Task<Cardapio> PegarCardapio(int id)
        {
            var cardapio =
                await _geralRepo.Pegar<Cardapio>(id);

            if (cardapio == null)
            {
                throw new NotFoundException(
                    "Cardápio não encontrado.");
            }

            return cardapio;
        }

        public async Task<List<Cardapio>> PegarTodosCardapios()
        {
            var cardapios =
                await _geralRepo.PegarTodos<Cardapio>();

            return cardapios.ToList();
        }
    }
}