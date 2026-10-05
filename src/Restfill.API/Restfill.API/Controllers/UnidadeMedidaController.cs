using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnidadeMedidaController : ControllerBase
    {
        private readonly IUnidadeMedidaService _unidademedidaService;

        public UnidadeMedidaController(IUnidadeMedidaService UnidadeMedidaService)
        {
            _unidademedidaService = UnidadeMedidaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UnidadeMedida>>> Get()
        {
            var unidadesMedida = await _unidademedidaService.PegarTodasUnidadesMedida();

            return Ok(unidadesMedida);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult <UnidadeMedida>> Get(int id)
        {
            var unidademedida = await _unidademedidaService.PegarUnidadeMedida(id);
            return Ok(unidademedida);
        }
    }
}