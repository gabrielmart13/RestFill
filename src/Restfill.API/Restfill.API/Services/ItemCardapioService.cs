using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class ItemCardapioService : IItemCardapioService
    {
        private readonly IGeralRepo _geralRepo;

        public ItemCardapioService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<ItemCardapio> AdicionarItemCardapio(
            ItemCardapio itemCardapio)
        {
            if (itemCardapio.IdRefeicao == null ||
                itemCardapio.IdCardapio == null ||
                itemCardapio.QuantidadePrevista <= 0 ||
                string.IsNullOrWhiteSpace(itemCardapio.Periodo))
            {
                throw new ValidationException(
                    "É preciso informar todos os campos obrigatórios.");
            }

            await _geralRepo.Adicionar(itemCardapio);

            return itemCardapio;
        }

        public async Task<ItemCardapio> AtualizarItemCardapio(
            int id,
            ItemCardapio itemCardapio)
        {
            var itemCardapioAtual =
                await _geralRepo.Pegar<ItemCardapio>(id);

            if (itemCardapioAtual == null)
            {
                throw new NotFoundException(
                    "Item do cardápio não encontrado.");
            }

            if (itemCardapio.IdRefeicao == null ||
                itemCardapio.IdCardapio == null ||
                itemCardapio.QuantidadePrevista <= 0 ||
                string.IsNullOrWhiteSpace(itemCardapio.Periodo))
            {
                throw new ValidationException(
                    "É preciso informar todos os campos obrigatórios.");
            }

            itemCardapioAtual.DiaDaSemana = itemCardapio.DiaDaSemana;
            itemCardapioAtual.IdRefeicao = itemCardapio.IdRefeicao;
            itemCardapioAtual.IdCardapio = itemCardapio.IdCardapio;
            itemCardapioAtual.QuantidadePrevista = itemCardapio.QuantidadePrevista;
            itemCardapioAtual.Periodo = itemCardapio.Periodo;

            return await _geralRepo.Atualizar(itemCardapioAtual);
        }

        public async Task<ItemCardapio> DeletarItemCardapio(int id)
        {
            var itemCardapio =
                await _geralRepo.Pegar<ItemCardapio>(id);

            if (itemCardapio == null)
            {
                throw new NotFoundException(
                    "Item do cardápio não encontrado.");
            }

            await _geralRepo.Remover(itemCardapio);

            return itemCardapio;
        }

        public async Task<ItemCardapio> PegarItemCardapio(int id)
        {
            var itemCardapio =
                await _geralRepo.Pegar<ItemCardapio>(id);

            if (itemCardapio == null)
            {
                throw new NotFoundException(
                    "Item do cardápio não encontrado.");
            }

            return itemCardapio;
        }

        public async Task<List<ItemCardapio>> PegarTodosItensCardapio()
        {
            var itensCardapio =
                await _geralRepo.PegarTodos<ItemCardapio>();

            return itensCardapio.ToList();
        }
    }
}