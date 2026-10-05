using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.IngredienteDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{

    [ApiController]
    [Route("api/[Controller]")]
    public class IngredienteController : ControllerBase
    {
        private readonly IIngredienteService _ingredienteService;

        public IngredienteController(IIngredienteService IngredienteService)
        {
            _ingredienteService = IngredienteService;
        }

        [HttpGet]
        public async Task<ActionResult <List<Ingrediente>>> Get()
        {
            var ingredientes = await _ingredienteService.PegarTodosIngredientes();
            return Ok(ingredientes);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult <Ingrediente>> Get(int id)
        {
            var ingredientes = await _ingredienteService.PegarIngrediente(id);
            return Ok(ingredientes);
        }
        [HttpPost]
        public async Task<ActionResult <Ingrediente>> Post(AdicionarIngredienteRequest request)
        {
            Ingrediente ingrediente = new Ingrediente
            {
                IdProduto = request.IdProduto,
                Quantidade = request.Quantidade,
                IdRefeicao = request.IdRefeicao
                
            };
            await _ingredienteService.AdicionarIngrediente(ingrediente);
            return Ok(ingrediente);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult <Ingrediente>> Put(int id, AtualizarIngredienteRequest request)
        {
            Ingrediente ingrediente = new Ingrediente
            {
                IdProduto = request.IdProduto,
                Quantidade = request.Quantidade,
                IdRefeicao = request.IdRefeicao

            };
            await _ingredienteService.AtualizarIngrediente(id,ingrediente);
            return Ok(ingrediente);
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult>  Delete(int id)
        {
            return Ok(await _ingredienteService.DeletarIngrediente(id));
        }
        

         
    }
}
