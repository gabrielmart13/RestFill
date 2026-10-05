using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Domain.Models;
using Restfill.API.Services.Interfaces;

namespace Restfill.API.Services
{
    public class GerenteService : IGerenteService
    {
        private readonly IGeralRepo _geralrepo;
        public GerenteService(IGeralRepo geralrepo) //Injeção de dependência do repositório
        {
            _geralrepo = geralrepo;
        }
        public async Task<Gerente> AtualizarGerente(int id, Gerente gerente)
        {
            var gerenteAtt = await _geralrepo.Pegar<Gerente>(id);
            if (gerenteAtt == null)
            {
                throw new ArgumentException("Gerente não encontrado.");
            }
            if (string.IsNullOrWhiteSpace(gerente?.Nome) || string.IsNullOrWhiteSpace(gerente?.Senha))
            {
                throw new Exception("Gerente precisa ter nome e senha");
            }

            gerenteAtt.Nome = gerente.Nome;
            gerenteAtt.Senha = gerente.Senha;

            return await _geralrepo.Atualizar<Gerente>(gerenteAtt);
        }

        public async Task<Gerente> CriarGerente(Gerente gerente)
        {
            if (string.IsNullOrWhiteSpace(gerente?.Nome) || string.IsNullOrWhiteSpace(gerente?.Senha))
            {
                throw new Exception("Gerente precisa ter nome e senha");
            }
            await _geralrepo.Adicionar<Gerente>(gerente);
            return gerente;
        }

        public async Task<Gerente> DeletarGerente(int id)
        {
            var gerente = await _geralrepo.Pegar<Gerente>(id);
            if (gerente == null)
            {
                throw new Exception("Gerente não encontrado");
            }
            await _geralrepo.Remover<Gerente>(gerente);
            return gerente;
        }

        public async Task<Gerente> PegarGerente(int id)
        {
            var gerente = await _geralrepo.Pegar<Gerente>(id);
            if (gerente == null)
            {
                throw new Exception("Gerente não encontrado");
            }
            return gerente;
        }

        public async Task<List<Gerente>> PegarTodosGerentes()
        {
            var gerentes = await _geralrepo.PegarTodos<Gerente>();
            return gerentes.ToList();
        }
    }
}
