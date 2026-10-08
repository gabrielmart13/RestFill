using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Exceptions;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class GerenteService : IGerenteService
    {
        private readonly IGeralRepo _geralRepo;

        public GerenteService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Gerente> AtualizarGerente(int id, Gerente gerente)
        {
            var gerenteAtual = await _geralRepo.Pegar<Gerente>(id);

            if (gerenteAtual == null)
            {
                throw new NotFoundException("Gerente não encontrado.");
            }

            if (string.IsNullOrWhiteSpace(gerente.Nome) ||
                string.IsNullOrWhiteSpace(gerente.Senha))
            {
                throw new ValidationException(
                    "Gerente precisa ter nome e senha.");
            }

            gerenteAtual.Nome = gerente.Nome;
            gerenteAtual.Senha = gerente.Senha;

            return await _geralRepo.Atualizar(gerenteAtual);
        }

        public async Task<Gerente> CriarGerente(Gerente gerente)
        {
            if (string.IsNullOrWhiteSpace(gerente.Nome) ||
                string.IsNullOrWhiteSpace(gerente.Senha))
            {
                throw new ValidationException(
                    "Gerente precisa ter nome e senha.");
            }

            await _geralRepo.Adicionar(gerente);

            return gerente;
        }

        public async Task<Gerente> DeletarGerente(int id)
        {
            var gerente = await _geralRepo.Pegar<Gerente>(id);

            if (gerente == null)
            {
                throw new NotFoundException(
                    "Gerente não encontrado.");
            }

            await _geralRepo.Remover(gerente);

            return gerente;
        }

        public async Task<Gerente> PegarGerente(int id)
        {
            var gerente = await _geralRepo.Pegar<Gerente>(id);

            if (gerente == null)
            {
                throw new NotFoundException(
                    "Gerente não encontrado.");
            }

            return gerente;
        }

        public async Task<List<Gerente>> PegarTodosGerentes()
        {
            var gerentes = await _geralRepo.PegarTodos<Gerente>();

            return gerentes.ToList();
        }
    }
}