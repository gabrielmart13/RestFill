using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{

    [ApiController]
    [Route("api/[Controller]")]
    public class IngredienteController : ControllerBase
    {
        private readonly DataContext _context;
        public IngredienteController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult <List<Ingrediente>>> Get()
        {
            var ingredientes = await _context.Ingredientes.ToListAsync();
            return Ok(ingredientes);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult <Ingrediente>> Get(int id)
        {
            var ingredientes = await _context.Ingredientes.FirstOrDefaultAsync(x => x.IdIngrediente == id);
            if(ingredientes == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(ingredientes);
        }
        [HttpPost]
        public async Task<ActionResult <Ingrediente>> Post(Ingrediente ingrediente)
        {
            await _context.Ingredientes.AddAsync(ingrediente);
            await _context.SaveChangesAsync();

            return Ok(ingrediente);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult <Ingrediente>> Put(int id, Ingrediente ingrediente)
        {
            var ingredientes = await _context.Ingredientes.FirstOrDefaultAsync(x => x.IdIngrediente == id);
            if (ingredientes == null)
            {
                return NotFound("ID não encontrado");
            }

            ingredientes.Quantidade = ingrediente.Quantidade;
            ingredientes.IdRefeicao = ingrediente.IdRefeicao;
            ingredientes.IdProduto = ingrediente.IdProduto;

            await _context.SaveChangesAsync();
            return Ok(ingredientes);
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult>  Delete(int id)
        {
            var ingredientes = await _context.Ingredientes.FirstOrDefaultAsync(x => x.IdIngrediente == id);
            if (ingredientes == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.Ingredientes.Remove(ingredientes);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        

         
    }
}
