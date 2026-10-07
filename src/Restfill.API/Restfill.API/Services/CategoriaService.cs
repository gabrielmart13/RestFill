using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IGeralRepo _geralRepo;

        public CategoriaService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Categoria> AtualizarCategoria(
            int id,
            Categoria categoria)
        {
            var categoriaAtual = await _geralRepo.Pegar<Categoria>(id);

            if (categoriaAtual == null)
            {
                throw new NotFoundException(
                    "Categoria não encontrada.");
            }

            if (string.IsNullOrWhiteSpace(categoria.Nome) ||
                string.IsNullOrWhiteSpace(categoria.Descricao))
            {
                throw new ValidationException(
                    "Categoria precisa ter nome e descrição.");
            }

            categoriaAtual.Nome = categoria.Nome;
            categoriaAtual.Descricao = categoria.Descricao;
            categoriaAtual.Icone = categoria.Icone;
            categoriaAtual.Cor = categoria.Cor;

            return await _geralRepo.Atualizar(categoriaAtual);
        }

        public async Task<Categoria> CriarCategoria(
            Categoria categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Nome) ||
                string.IsNullOrWhiteSpace(categoria.Descricao))
            {
                throw new ValidationException(
                    "Nome e descrição são obrigatórios.");
            }

            await _geralRepo.Adicionar(categoria);

            return categoria;
        }

        public async Task<Categoria> DeletarCategoria(int id)
        {
            var produtosDeCategorias = await _geralRepo.PegarTodos<Produto>();
            var categoria = await _geralRepo.Pegar<Categoria>(id);

            if (categoria == null)
            {
                throw new NotFoundException(
                    "Categoria não encontrada.");
            }
            foreach(Produto produtos in produtosDeCategorias)
            {
                if (categoria.IdCategoria == produtos.IdCategoria )
                {
                    if (produtos.Ativo)
                    {
                        throw new ConflictException("Voce não pode excluir uma categoria com produtos cadastrados");
                    }
                }
            }

            await _geralRepo.Remover(categoria);

            return categoria;
        }

        public async Task<Categoria> PegarCategoria(int id)
        {
            var categoria = await _geralRepo.Pegar<Categoria>(id);

            if (categoria == null)
            {
                throw new NotFoundException(
                    "Categoria não encontrada.");
            }

            return categoria;
        }

        public async Task<List<Categoria>> PegarTodasCategorias()
        {
            var categorias =
                await _geralRepo.PegarTodos<Categoria>();

            return categorias.ToList();
        }
    }
}