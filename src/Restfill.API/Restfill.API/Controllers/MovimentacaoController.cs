using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacaoController : ControllerBase
    {
        private readonly DataContext _context;

        public MovimentacaoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Movimentacao>>> Get()
        {
            var movimentacoes = await _context.Movimentacoes.ToListAsync();

            return Ok(movimentacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movimentacao>> Get(int id)
        {
            var movimentacoes = await _context.Movimentacoes
                .FirstOrDefaultAsync(x => x.IdMovimentacao == id);

            if (movimentacoes == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(movimentacoes);
        }

        [HttpPost]
        public async Task<ActionResult<Movimentacao>> Post(Movimentacao movimentacao)
        {
            await _context.Movimentacoes.AddAsync(movimentacao);
            await _context.SaveChangesAsync();

            return Ok(movimentacao);
        }
    }
}