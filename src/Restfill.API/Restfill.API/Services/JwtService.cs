using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Restfill.API.Domain.Models;

namespace Restfill.API.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GerarToken(Gerente gerente)
        {
            var jwtKey = _configuration["Jwt:Key"];

            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new InvalidOperationException(
                    "A chave JWT não foi configurada."
                );
            }

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    gerente.IdGerente.ToString()
                ),

                new Claim(
                    ClaimTypes.Name,
                    gerente.Nome
                )
            };

            var chave = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

            var credenciais = new SigningCredentials(
                chave,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credenciais
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}