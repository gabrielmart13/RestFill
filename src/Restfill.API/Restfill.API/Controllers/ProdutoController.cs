using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Models;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly DataContext _context;

        public ProdutoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult <List<Produto>>> Get()
        {
            var produtos = await _context.Produtos.ToListAsync();
            return Ok(produtos);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult <Produto>> Get(int id)
        {
            var produtos = await _context.Produtos.FirstOrDefaultAsync(x => x.IdProduto == id);
            if(produtos == null)
            {
                return NotFound("Id não encontrado");
            }
            return Ok(produtos);
        }

        [HttpPost]
        public async Task<ActionResult <Produto>> Post(Produto produto)
        {
            await _context.Produtos.AddAsync(produto);
            await _context.SaveChangesAsync();

            return Ok(produto);
        }

        [HttpPut("{id}")]

        public async Task<ActionResult <Produto>> Put(int id, Produto produto)
        {
            var produtos = await _context.Produtos.FirstOrDefaultAsync(x => x.IdProduto == id);
            if (produtos == null)
            {
                return NotFound("Id não encontrado");
            }

            produtos.CustoPorKg = produto.CustoPorKg;
            produtos.Descricao = produto.Descricao;
            produtos.IdUnidadeMedida = produto.IdUnidadeMedida;
            produtos.Validade = produto.Validade;
            produtos.Quantidade = produto.Quantidade;
            produtos.QuantidadeMinima = produto.QuantidadeMinima;
            produtos.IdCategoria = produto.IdCategoria;
            produtos.Nome = produto.Nome;

            await _context.SaveChangesAsync();
            return Ok(produtos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var produtos = await _context.Produtos.FirstOrDefaultAsync(x => x.IdProduto == id);
            if (produtos == null)
            {
                return NotFound("Id não encontrado");
            }
            _context.Produtos.Remove(produtos);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}