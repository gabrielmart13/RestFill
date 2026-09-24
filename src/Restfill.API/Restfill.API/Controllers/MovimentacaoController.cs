using Microsoft.AspNetCore.Mvc;
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
        public ActionResult <List<Movimentacao>> Get()
        {
            return new List<Movimentacao>();
        }
        [HttpGet("{id}")]
        public ActionResult <Movimentacao> Get(int id)
        {
            return new Movimentacao();
        }

        [HttpPost]
        public ActionResult <Movimentacao> Post(Movimentacao movimentacao)
        {
            return new Movimentacao();
        }
    }
}
