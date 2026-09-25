using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CardapioController : ControllerBase
    {
        private readonly DataContext _context;
        public CardapioController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult <List<Cardapio>>> Get()
        {
            var cardapios = await _context.Cardapios.ToListAsync();
            return Ok(cardapios);
        }

        [HttpPost]

        public async Task<ActionResult <Cardapio>> Post(Cardapio cardapio)
        {
            await _context.Cardapios.AddAsync(cardapio);
            await _context.SaveChangesAsync();

            return Ok("Cardapio adicionado com sucesso");
        }

        [HttpPut ("{id}")]
        public async Task<ActionResult <Cardapio>> Put(int id, Cardapio cardapio)
        {
            var cardapios = await _context.Cardapios.FirstOrDefaultAsync(x => x.IdCardapio == id);
            
            if(cardapios == null)
            {
                return NotFound("Id não encontrado");
            }

            cardapios.Nome = cardapio.Nome;
            cardapios.Descricao = cardapio.Descricao;
            cardapios.Ativo = cardapio.Ativo;
            await _context.SaveChangesAsync();

            return Ok("Alteracao feita com sucesso");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cardapios = await _context.Cardapios.FirstOrDefaultAsync(x => x.IdCardapio == id);

            if (cardapios == null)
            {
                return NotFound("Id não encontrado");
            }

            _context.Cardapios.Remove(cardapios);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
