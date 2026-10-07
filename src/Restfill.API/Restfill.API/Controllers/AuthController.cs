using Microsoft.AspNetCore.Mvc;
using Restfill.API.Services;

namespace Restfill.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly JwtService _jwtService;

        public AuthController(
            AuthService authService,
            JwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var gerente = _authService.Autenticar(request.Senha);

            if (gerente == null)
            {
                return Unauthorized(new
                {
                    mensagem = "Senha incorreta."
                });
            }

            var token = _jwtService.GerarToken(gerente);

            return Ok(new
            {
                mensagem = "Login realizado com sucesso.",
                token
            });
        }
    }

    public class LoginRequest
    {
        public string Senha { get; set; } = string.Empty;
    }
}