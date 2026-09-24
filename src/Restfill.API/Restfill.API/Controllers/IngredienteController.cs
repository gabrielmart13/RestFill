using Microsoft.AspNetCore.Mvc;
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
        public ActionResult <List<Ingrediente>> Get()
        {
            return new List<Ingrediente>();
        }
        [HttpGet("{id}")]
        public ActionResult <Ingrediente> Get(int id)
        {
            return new Ingrediente();
        }
        [HttpPost]
        public ActionResult <Ingrediente> Post(Ingrediente ingrediente)
        {
            return new Ingrediente();
        }
        [HttpPut("{id}")]
        public ActionResult <Ingrediente> Put(int id, Ingrediente ingrediente)
        {
            return new Ingrediente();
        }

        [HttpDelete("{id}")]

        public IActionResult  Delete(int id)
        {
            return NoContent();
        }
        

         
    }
}
