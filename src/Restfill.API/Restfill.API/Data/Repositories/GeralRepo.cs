using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Restfill.API.Data.Repositories.Interfaces;

namespace Restfill.API.Data.Repositories
{
    public class GeralRepo : IGeralRepo
    {
        private readonly DataContext _context;
        private int resultado;

        public GeralRepo(DataContext context) //Fazendo injeção de dependência do DataContext
        {
            _context = context;
        }

        public async Task<T> Adicionar<T>(T entity) where T : class
        {
            _context.Set<T>().Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<T> Atualizar<T>(T entity) where T : class
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<T?> Pegar<T>(int id) where T : class
        {
            var entity = await _context.Set<T>().FindAsync(id);

            return entity;
        }

        public async Task<IEnumerable<T>> PegarTodos<T>() where T : class
        {
            var entities = await _context.Set<T>().ToListAsync();
            return entities;
        }

        public async Task<T> Remover<T>(T entity) where T : class
        {
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<bool> SalvarMudancasAsync()
        {
            var resultado = await _context.SaveChangesAsync();
            return resultado > 0;
        }

    }
}
