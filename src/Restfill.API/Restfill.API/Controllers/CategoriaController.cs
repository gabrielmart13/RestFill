using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly DataContext _context;

        public CategoriaController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Categoria>>> Get()
        {
            var categorias = await _context.Categorias.ToListAsync();
            return Ok(categorias);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> Get(int id)
        {
            var categorias = await _context.Categorias.FirstOrDefaultAsync(x => x.IdCategoria == id);
            if(categorias == null)
            {
                return NotFound("Id não encontrado");
            }

            return Ok(categorias);
        }
        [HttpPost]
        public async Task<ActionResult<Categoria>> Post(Categoria categoria)
        {
            await _context.Categorias.AddAsync(categoria);
            await _context.SaveChangesAsync();

            return Ok(categoria);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Categoria>> Put(int id, Categoria categoria)
        {
            var categorias = await _context.Categorias.FirstOrDefaultAsync(x => x.IdCategoria == id);
            if (categorias == null)
            {
                return NotFound("Id não encontrado");
            }

            categorias.Cor = categoria.Cor;
            categorias.Descricao = categoria.Descricao;
            categorias.Icone = categoria.Icone;
            categorias.Nome = categoria.Nome;

            await _context.SaveChangesAsync();

            return Ok(categorias);
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> Delete(int id)
        {
            var categorias = await _context.Categorias.FirstOrDefaultAsync(x => x.IdCategoria == id);
            if (categorias == null)
            {
                return NotFound();
            }

            _context.Categorias.Remove(categorias);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
