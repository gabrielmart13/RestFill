using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.CardapioDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    [Authorize]
    public class CardapioController : ControllerBase
    {
        private readonly ICardapioService _serviceCardapio;
       
        public CardapioController (ICardapioService CardapioService)
        {
            _serviceCardapio = CardapioService;
        }

        [HttpGet]
        public async Task<ActionResult <List<Cardapio>>> Get()
        {
            var cardapios = await _serviceCardapio.PegarTodosCardapios();
            return Ok(cardapios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult <Cardapio>> Get(int id)
        {
            var cardapio = await _serviceCardapio.PegarCardapio(id);
            return Ok(cardapio);
        }
        [HttpPut ("{id}")]
        public async Task<ActionResult <Cardapio>> Put(int id, AtualizarCardapioRequest request)
        {
            Cardapio cardapio = new Cardapio();
            
            cardapio.Nome = request.Nome;
            cardapio.Descricao = request.Descricao;
            cardapio.Ativo = request.Ativo;


            return Ok(await _serviceCardapio.AtualizarCardapio(id, cardapio));
        }

    }
}
