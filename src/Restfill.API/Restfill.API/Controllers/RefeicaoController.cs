using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RefeicaoController : ControllerBase
    {
        private readonly DataContext _context;

        public RefeicaoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]

        public async Task<ActionResult<List<Refeicao>>> Get()
        {
            var refeicoes = await _context.Refeicoes.ToListAsync();
            return Ok(refeicoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Refeicao>> Get(int id)
        {
            var refeicoes = await _context.Refeicoes.FirstOrDefaultAsync(x => x.IdRefeicao == id);
            if(refeicoes == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(refeicoes);
        }

       [HttpPost]

        public async Task<ActionResult <Refeicao>> Post(Refeicao refeicao)
        {
            await _context.Refeicoes.AddAsync(refeicao);
            await _context.SaveChangesAsync();

            return Ok(refeicao);
        }
        [HttpPut("{id}")]

        public async Task<ActionResult <Refeicao>> Put(int id, Refeicao refeicao)
        {
            var refeicoes = await _context.Refeicoes.FirstOrDefaultAsync(x => x.IdRefeicao == id);
            if (refeicoes == null)
            {
                return NotFound("ID não encontrado");
            }
            refeicoes.Descricao = refeicao.Descricao;
            refeicoes.Nome = refeicao.Nome;

            await _context.SaveChangesAsync();

            return Ok(refeicoes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var refeicoes = await _context.Refeicoes.FirstOrDefaultAsync(x => x.IdRefeicao == id);
            if (refeicoes == null)
            {
                return NotFound("ID não encontrado");
            }
            _context.Refeicoes.Remove(refeicoes);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
         
    }
}
