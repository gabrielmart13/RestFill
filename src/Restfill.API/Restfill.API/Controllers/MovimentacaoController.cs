using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.MovimentacaoDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacaoController : ControllerBase
    {
        private readonly IMovimentacaoService _movimentacaoService;

        public MovimentacaoController(IMovimentacaoService MovimentacaoService)
        {
            _movimentacaoService = MovimentacaoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Movimentacao>>> Get()
        {
            var movimentacoes = await _movimentacaoService.PegarTodasMovimentacoes();

            return Ok(movimentacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movimentacao>> Get(int id)
        {
            var movimentacoes = await _movimentacaoService.PegarMovimentacao(id);
            return Ok(movimentacoes);
        }

        [HttpPost]
        public async Task<ActionResult<Movimentacao>> Post(AdicionarMovimentacaoRequest request)
        {
            Movimentacao movimentacao = new Movimentacao
            {
                IdProduto = request.IdProduto,
                Quantidade = request.Quantidade,
                Tipo = request.Tipo,
                Data = request.Data,
                Observacao = request.Observacao,
                IdGerente = request.IdGerente,
                Custo = request.Custo
            };

            await _movimentacaoService.AdicionarMovimentacao(movimentacao);
            return Ok(movimentacao);
        }
    }
}