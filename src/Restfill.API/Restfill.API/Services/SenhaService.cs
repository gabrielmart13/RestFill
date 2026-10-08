using Microsoft.AspNetCore.Identity;
using Restfill.API.Domain.Models;

namespace Restfill.API.Services
{
    public class PasswordService
    {
        private readonly PasswordHasher<Gerente> _passwordHasher;

        public PasswordService()
        {
            _passwordHasher = new PasswordHasher<Gerente>();
        }

        public string HashPassword(Gerente gerente, string senha)
        {
            return _passwordHasher.HashPassword(gerente, senha);
        }

        public bool VerificarSenha(
            Gerente gerente,
            string senha,
            string senhaHash)
        {
            var resultado = _passwordHasher.VerifyHashedPassword(
                gerente,
                senhaHash,
                senha
            );

            return resultado == PasswordVerificationResult.Success ||
                   resultado == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}