using Microsoft.AspNetCore.Mvc;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly DataContext _context;

        public ProdutoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult <List<Produto>> Get()
        {
            return new List<Produto>();
        }

        [HttpGet("{id}")]

        public ActionResult <Produto> Get(int id)
        {
            return new Produto();
        }

        [HttpPost]
        public ActionResult <Produto> Post(Produto produto)
        {
            return new Produto();
        }

        [HttpPut("{id}")]

        public ActionResult <Produto> Put(int id, Produto produto)
        {
            return new Produto();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }


    }
}