using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ItemCardapioController : ControllerBase
    {
        private readonly DataContext _context;

        public ItemCardapioController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<ItemCardapio>>> Get()
        {
            var itensCardapio = await _context.ItensCardapio.ToListAsync();

            return Ok(itensCardapio);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemCardapio>> Get(int id)
        {
            var itensCardapio = await _context.ItensCardapio
                .FirstOrDefaultAsync(x => x.IdItemCardapio == id);

            if (itensCardapio == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(itensCardapio);
        }

        [HttpPost]
        public async Task<ActionResult<ItemCardapio>> Post(ItemCardapio itemcardapio)
        {
            await _context.ItensCardapio.AddAsync(itemcardapio);
            await _context.SaveChangesAsync();

            return Ok(itemcardapio);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ItemCardapio>> Put(int id, ItemCardapio itemcardapio)
        {
            var itensCardapio = await _context.ItensCardapio
                .FirstOrDefaultAsync(x => x.IdItemCardapio == id);

            if (itensCardapio == null)
            {
                return NotFound("ID não encontrado");
            }

            itensCardapio.DiaDaSemana = itemcardapio.DiaDaSemana;
            itensCardapio.QuantidadePrevista = itemcardapio.QuantidadePrevista;
            itensCardapio.Periodo = itemcardapio.Periodo;
            itensCardapio.IdCardapio = itemcardapio.IdCardapio;
            itensCardapio.IdRefeicao = itemcardapio.IdRefeicao;

            await _context.SaveChangesAsync();

            return Ok(itensCardapio);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var itensCardapio = await _context.ItensCardapio
                .FirstOrDefaultAsync(x => x.IdItemCardapio == id);

            if (itensCardapio == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.ItensCardapio.Remove(itensCardapio);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}