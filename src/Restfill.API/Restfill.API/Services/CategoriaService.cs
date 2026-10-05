using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IGeralRepo _geralrepo;
        public CategoriaService(IGeralRepo geralrepo) //Injeção de dependência do repositório
        {
            _geralrepo = geralrepo;
        }
        public async Task<Categoria> AtualizarCategoria(int id, Categoria categoria)
        {
            var categoriaAtt = await _geralrepo.Pegar<Categoria>(id);
            if (categoriaAtt == null)
            {
                throw new ArgumentException("Categoria não encontrada.");
            }
            if (string.IsNullOrWhiteSpace(categoria?.Nome) || string.IsNullOrWhiteSpace(categoria?.Descricao))
            {
                throw new Exception("Categoria precisa ter nome e descrição");
            }

            categoriaAtt.Nome = categoria.Nome;
            categoriaAtt.Descricao = categoria.Descricao;
            categoriaAtt.Icone = categoria.Icone;
            categoriaAtt.Cor = categoria.Cor;

            return await _geralrepo.Atualizar<Categoria>(categoriaAtt);
        }

        public async Task<Categoria> CriarCategoria(Categoria categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Nome) || string.IsNullOrWhiteSpace(categoria.Descricao))
            {
                throw new Exception("Nome e Descrição são obrigatórios");
            }
            await _geralrepo.Adicionar<Categoria>(categoria);
            
            return categoria;
        }

        public async Task<Categoria> DeletarCategoria(int id)
        {
            var categoria = await _geralrepo.Pegar<Categoria>(id);
            if (categoria == null)
            {
                throw new Exception("Categoria não encontrada");
            }
            await _geralrepo.Remover<Categoria>(categoria);
            return categoria;
        }
            
        public async Task<Categoria> PegarCategoria(int id)
        {
            var categoria = await _geralrepo.Pegar<Categoria>(id);
            if (categoria == null)
            {
                throw new Exception("Categoria não encontrada");
            }
            return categoria;
        }

        public async Task<List<Categoria>> PegarTodasCategorias()
        {
            var categorias = await _geralrepo.PegarTodos<Categoria>();
            return categorias.ToList();
        }
    }
}
