using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnidadeMedidaController : ControllerBase
    {
        private readonly DataContext _context;

        public UnidadeMedidaController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<UnidadeMedida>>> Get()
        {
            var unidadesMedida = await _context.UnidadesMedida.ToListAsync();

            return Ok(unidadesMedida);
        }
    }
}