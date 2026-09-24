using Microsoft.AspNetCore.Mvc;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ItemCardapioController : ControllerBase
    {
        private readonly DataContext _context;

        public ItemCardapioController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult <List<ItemCardapio>> Get()
        {
            return new List<ItemCardapio>();
        }

        [HttpGet("{id}")]
        public ActionResult <ItemCardapio> Get(int id)
        {
            return new ItemCardapio();
        }

        [HttpPost]
        public ActionResult <ItemCardapio> Post(ItemCardapio itemcardapio)
        {
            return new ItemCardapio();
        }

        [HttpPut("{id}")]
        public ActionResult <ItemCardapio> Put(int id, ItemCardapio itemcardapio)
        {
            return new ItemCardapio();
        }
        [HttpDelete("{id}")]
        public IActionResult  Delete(int id)
        {
            return NoContent();
        }

    }
}
