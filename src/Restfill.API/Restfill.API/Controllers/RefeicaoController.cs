using Microsoft.AspNetCore.Mvc;
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

        public ActionResult<List<Refeicao>> Get()
        {
            return new List<Refeicao>();
        }

        [HttpGet("{id}")]
        public ActionResult<Refeicao> Get(int id)
        {
            return new Refeicao();
        }

       [HttpPost]

        public ActionResult <Refeicao> Post(Refeicao refeicao)
        {
            return new Refeicao();
        }
        [HttpPut("{id}")]

        public ActionResult <Refeicao> Put(int id, Refeicao refeicao)
        {
            return new Refeicao();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
        
         
    }
}
