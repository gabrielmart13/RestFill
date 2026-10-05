using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.GerenteDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class GerenteController : ControllerBase
    {
        private readonly IGerenteService _gerenteService;

        public GerenteController(IGerenteService GerenteService)
        {
            _gerenteService = GerenteService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Gerente>>> Get()
        {
            var gerentes = await _gerenteService.PegarTodosGerentes();

            return Ok(gerentes);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Gerente>> Get(int id)
        {
            var gerente = await _gerenteService.PegarGerente(id);
            return Ok(gerente);
        }

        [HttpPost]
        public async Task<ActionResult<Gerente>> Post(CriarGerenteRequest request)
        {
            Gerente gerente = new Gerente
            {
                Nome = request.Nome,
                Senha = request.Senha

            };
            await _gerenteService.CriarGerente(gerente);
            return Ok(gerente);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Gerente>> Put(int id, AtualizarGerenteRequest request)
        {
            Gerente gerente = new Gerente
            {
                Nome = request.Nome,
                Senha = request.Senha

            };
            await _gerenteService.AtualizarGerente(id,gerente);
            return Ok(gerente);
        }

        [HttpDelete("{id}")]
        public  async Task<IActionResult> Delete(int id)
        {
            return Ok(await _gerenteService.DeletarGerente(id));
        }
    }
}