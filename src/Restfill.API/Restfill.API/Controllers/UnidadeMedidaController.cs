using Microsoft.AspNetCore.Mvc;
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

        public ActionResult<List<UnidadeMedida>> Get()
        {
            return new List<UnidadeMedida>();
        }

    }
}
