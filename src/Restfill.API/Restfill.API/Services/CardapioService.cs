using Microsoft.AspNetCore.Http.HttpResults;
using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class CardapioService : ICardapioService
    {
        private readonly IGeralRepo _geralrepo;
        public CardapioService(IGeralRepo geralrepo) //Injeção de dependência do repositório
        {
            _geralrepo = geralrepo;
        }
        public async Task<Cardapio> AtualizarCardapio(int id, Cardapio cardapio)
        {
            var cardapioAtt = await _geralrepo.Pegar<Cardapio>(id);

            if (cardapioAtt == null) throw new Exception("Cardápio não encontrado.");

            cardapioAtt.Nome = cardapio.Nome;
            cardapioAtt.Descricao = cardapio.Descricao;
            cardapioAtt.Ativo = cardapio.Ativo;

            await _geralrepo.Atualizar(cardapioAtt);

            return cardapioAtt;
        }

        public async Task<Cardapio> PegarCardapio(int id)
        {
            var cardapio = await _geralrepo.Pegar<Cardapio>(id);
            if (cardapio == null) throw new Exception("Cardápio não encontrado.");

            return cardapio;
        }

        public async Task<List<Cardapio>> PegarTodosCardapios()
        {
            var cardapios = await _geralrepo.PegarTodos<Cardapio>();

            return cardapios.ToList();

        }
    }
}
