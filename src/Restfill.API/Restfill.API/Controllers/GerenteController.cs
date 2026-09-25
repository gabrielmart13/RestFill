using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class GerenteController : ControllerBase
    {
        private readonly DataContext _context;

        public GerenteController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Gerente>>> Get()
        {
            var gerentes = await _context.Gerentes.ToListAsync();

            return Ok(gerentes);
        }

        [HttpPost]
        public async Task<ActionResult<Gerente>> Post(Gerente gerente)
        {
            await _context.Gerentes.AddAsync(gerente);
            await _context.SaveChangesAsync();

            return Ok(gerente);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Gerente>> Put(int id, Gerente gerente)
        {
            var gerentes = await _context.Gerentes
                .FirstOrDefaultAsync(x => x.IdGerente == id);

            if (gerentes == null)
            {
                return NotFound("ID não encontrado");
            }

            gerentes.Nome = gerente.Nome;
            gerentes.Senha = gerente.Senha;

            await _context.SaveChangesAsync();

            return Ok(gerentes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var gerentes = await _context.Gerentes
                .FirstOrDefaultAsync(x => x.IdGerente == id);

            if (gerentes == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.Gerentes.Remove(gerentes);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}