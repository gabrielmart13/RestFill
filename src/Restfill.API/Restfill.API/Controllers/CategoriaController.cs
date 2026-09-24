using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<List<Categoria>> Get()
        {
            return new List<Categoria>();
        }
        [HttpGet("{id}")]
        public ActionResult<Categoria> Get(int id)
        {
            return new Categoria();
        }
        [HttpPost]
        public ActionResult<Categoria> Post(Categoria categoria)
        {
            return new Categoria();
        }
        [HttpPut("{id}")]
        public ActionResult<Categoria> Put(int id, Categoria categoria)
        {
            return new Categoria();
        }

        [HttpDelete("{id}")]

        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
