using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
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

        public async Task<ItemCardapio> AdicionarItemCardapio(ItemCardapio itemCardapio)
        {
            if(itemCardapio.IdRefeicao == null || itemCardapio.IdCardapio == null || 
                itemCardapio.QuantidadePrevista <= 0 ||string.IsNullOrWhiteSpace(itemCardapio.Periodo))
            {
                throw new ArgumentException("E preciso informar todos itens obrigatórios.");
            }
            await _geralRepo.Adicionar<ItemCardapio>(itemCardapio);
            return itemCardapio;
        }

        public async Task<ItemCardapio> AtualizarItemCardapio(int id, ItemCardapio itemCardapio)
        {
            var itemCardapioAtt = await _geralRepo.Pegar<ItemCardapio>(id);
            if (itemCardapioAtt == null)
            {
                throw new ArgumentException("Item do cardápio não encontrado.");
            }

            if (itemCardapio.IdRefeicao == null || itemCardapio.IdCardapio == null ||
                    itemCardapio.QuantidadePrevista <= 0 || string.IsNullOrWhiteSpace(itemCardapio.Periodo))
            {
                throw new ArgumentException("E preciso informar todos itens obrigatórios.");
            }
            itemCardapioAtt.DiaDaSemana = itemCardapio.DiaDaSemana;
            itemCardapioAtt.IdRefeicao = itemCardapio.IdRefeicao;
            itemCardapioAtt.IdCardapio = itemCardapio.IdCardapio;
            itemCardapioAtt.QuantidadePrevista = itemCardapio.QuantidadePrevista;
            itemCardapioAtt.Periodo = itemCardapio.Periodo;

            await _geralRepo.Atualizar<ItemCardapio>(itemCardapioAtt);
            return itemCardapioAtt;
        }

        public async Task<ItemCardapio> DeletarItemCardapio(int id)
        {
            var itemCardapio = await _geralRepo.Pegar<ItemCardapio>(id);
            if (itemCardapio == null)
            {
                throw new ArgumentException("Item do cardápio não encontrado.");
            }
            await _geralRepo.Remover<ItemCardapio>(itemCardapio);
            return itemCardapio;
        }

        public async Task<ItemCardapio> PegarItemCardapio(int id)
        {
            var itemCardapio = await _geralRepo.Pegar<ItemCardapio>(id);
            if (itemCardapio == null)
            {
                throw new ArgumentException("Item do cardápio não encontrado.");
            }
            return itemCardapio;
        }

        public async Task<List<ItemCardapio>> PegarTodosItensCardapio()
        {
            var itensCardapio = await _geralRepo.PegarTodos<ItemCardapio>();
            return itensCardapio.ToList();
        }
    }
}
