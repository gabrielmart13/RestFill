using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Restfill.API.Data;
using Restfill.API.Domain.DTOs.CategoriaDTO;
using Restfill.API.Domain.Models;
using Restfill.API.Services;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    [Authorize]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;

        public CategoriaController (ICategoriaService CategoriaService)
        {
            _categoriaService = CategoriaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Categoria>>> Get()
        {
            var categorias = await _categoriaService.PegarTodasCategorias();
            return Ok(categorias);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> Get(int id)
        {
            var categorias = await _categoriaService.PegarCategoria(id);

            return Ok(categorias);
        }
        [HttpPost]
        public async Task<ActionResult<Categoria>> Post(CriarCategoriaRequest request)
        {
            Categoria categoria = new Categoria
            {
                Nome = request.Nome,
                Descricao = request.Descricao,
                Icone = request.Icone,
                Cor = request.Cor
            };
            await _categoriaService.CriarCategoria(categoria);
            return Ok(categoria);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Categoria>> Put(int id, AtualizarCategoriaRequest request)
        {
            Categoria categoria = new Categoria
            {
                Nome = request.Nome,
                Descricao = request.Descricao,
                Icone = request.Icone,
                Cor = request.Cor
            };
            await _categoriaService.AtualizarCategoria(id,categoria);
            return Ok(categoria);
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _categoriaService.DeletarCategoria(id));
        }
    }
}
