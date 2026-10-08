using Restfill.API.Data;
using Restfill.API.Domain.Models;

namespace Restfill.API.Services
{
    public class AuthService
    {
        private readonly DataContext _context;
        private readonly PasswordService _passwordService;

        public AuthService(
            DataContext context,
            PasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        public Gerente? Autenticar(string senha)
        {
            var gerente = _context.Gerentes.FirstOrDefault();

            if (gerente == null)
                return null;

            var senhaValida = _passwordService.VerificarSenha(
                gerente,
                senha,
                gerente.Senha
            );

            if (!senhaValida)
                return null;

            return gerente;
        }
    }
}