using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.RefeicaoDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RefeicaoController : ControllerBase
    {
        private readonly IRefeicaoService _refeicaoService;

        public RefeicaoController(IRefeicaoService RefeicaoService)
        {
            _refeicaoService = RefeicaoService;
        }

        [HttpGet]

        public async Task<ActionResult<List<Refeicao>>> Get()
        {
            var refeicoes = await _refeicaoService.PegarTodasRefeicoes();
            return Ok(refeicoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Refeicao>> Get(int id)
        {
            var refeicoes = await _refeicaoService.PegarRefeicao(id);
            return Ok(refeicoes);
        }

       [HttpPost]

        public async Task<ActionResult <Refeicao>> Post(CriarRefeicaoRequest request)
        {
            Refeicao refeicao = new Refeicao
            {
                Nome = request.Nome,
                Descricao = request.Descricao
            };
            await _refeicaoService.CriarRefeicao(refeicao);
            return Ok(refeicao);
        }
        [HttpPut("{id}")]

        public async Task<ActionResult <Refeicao>> Put(int id, AtualizarRefeicaoRequest request)
        {
            Refeicao refeicao = new Refeicao
            {
                Nome = request.Nome,
                Descricao = request.Descricao
            };
            await _refeicaoService.AtualizarRefeicao(id,refeicao);
            return Ok(refeicao);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _refeicaoService.DeletarRefeicao(id));
        }
        
         
    }
}
