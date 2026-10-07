using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.ItemCardapioDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ItemCardapioController : ControllerBase
    {
        private readonly IItemCardapioService _itemcardapioService;

        public ItemCardapioController(IItemCardapioService ItemCardapioService)
        {
            _itemcardapioService = ItemCardapioService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ItemCardapio>>> Get()
        {
            var itensCardapio = await _itemcardapioService.PegarTodosItensCardapio();

            return Ok(itensCardapio);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemCardapio>> Get(int id)
        {
            var itensCardapio = await _itemcardapioService.PegarItemCardapio(id);

            return Ok(itensCardapio);
        }

        [HttpPost]
        public async Task<ActionResult<ItemCardapio>> Post(AdicionarItemCardapioRequest request)
        {
            ItemCardapio itemcardapio = new ItemCardapio
            {
                DiaDaSemana = request.DiaDaSemana,
                IdCardapio = request.IdCardapio,
                IdRefeicao = request.IdRefeicao,
                QuantidadePrevista = request.QuantidadePrevista,
                Periodo = request.Periodo
            };
            await _itemcardapioService.AdicionarItemCardapio(itemcardapio);
            return Ok(itemcardapio);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ItemCardapio>> Put(int id, AdicionarItemCardapioRequest request)
        {
            ItemCardapio itemcardapio = new ItemCardapio
            {
                DiaDaSemana = request.DiaDaSemana,
                IdCardapio = request.IdCardapio,
                IdRefeicao = request.IdRefeicao,
                QuantidadePrevista = request.QuantidadePrevista,
                Periodo = request.Periodo
            };
            await _itemcardapioService.AtualizarItemCardapio(id,itemcardapio);
            return Ok(itemcardapio);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _itemcardapioService.DeletarItemCardapio(id));
        }
    }
}