using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.ProdutoDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly IProdutoService _produtoService;

        public ProdutoController(IProdutoService ProdutoService)
        {
            _produtoService = ProdutoService;
        }

        [HttpGet]
        public async Task<ActionResult <List<Produto>>> Get()
        {
            var produtos = await _produtoService.PegarTodosProdutos();
            return Ok(produtos);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult <Produto>> Get(int id)
        {
            var produtos = await _produtoService.PegarProduto(id);
            return Ok(produtos);
        }

        [HttpPost]
        public async Task<ActionResult <Produto>> Post(AdicionarProdutoRequest request)
        {
            Produto produto = new Produto
            {
                Nome = request.Nome,
                Descricao = request.Descricao,
                CustoPorKg = request.CustoPorKg,
                Validade = request.Validade,
                Quantidade = request.Quantidade,
                QuantidadeMinima = request.QuantidadeMinima,
                IdCategoria = request.IdCategoria,
                IdUnidadeMedida = request.IdUnidadeMedida
            };
            await _produtoService.CriarProduto(produto);
            return Ok(produto);
        }

        [HttpPut("{id}")]

        public async Task<ActionResult <Produto>> Put(int id, AtualizarProdutoRequest request)
        {
            Produto produto = new Produto
            {
                Nome = request.Nome,
                Descricao = request.Descricao,
                CustoPorKg = request.CustoPorKg,
                Validade = request.Validade,
                Quantidade = request.Quantidade,
                QuantidadeMinima = request.QuantidadeMinima,
                IdCategoria = request.IdCategoria,
                IdUnidadeMedida = request.IdUnidadeMedida
            };
            await _produtoService.AtualizarProduto(id,produto);
            return Ok(produto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _produtoService.DeletarProduto(id));
        }


    }
}