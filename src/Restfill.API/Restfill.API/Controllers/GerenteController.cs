using Microsoft.AspNetCore.Mvc;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class GerenteController : ControllerBase
    {
        private readonly DataContext _context;
        public GerenteController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Gerente>> Get()
        {
            return new List<Gerente>();
        }

        [HttpPost]
        public ActionResult<Gerente> Post(Gerente gerente)
        {
            return new Gerente();
        }
        [HttpPut("{id}")]
        public ActionResult<Gerente> Put(int id, Gerente gerente)
        {
            return new Gerente();
        }


    }
}
