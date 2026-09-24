using Microsoft.AspNetCore.Mvc;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CardapioController : ControllerBase
    {
        private readonly DataContext _context;
        public CardapioController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult <List<Cardapio>> Get()
        {
            return new List<Cardapio>();
        }

        [HttpPut ("{id}")]
        public ActionResult <Cardapio> Put(int id, Cardapio cardapio)
        {
            return new Cardapio();
        }
    }
}
