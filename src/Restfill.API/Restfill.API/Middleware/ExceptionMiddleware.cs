using System.Text.Json;
using Restfill.API.Exceptions;

namespace Restfill.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
        {
            int statusCode;
            string code;
            string message;

            switch (exception)
            {
                case NotFoundException:
                    statusCode = StatusCodes.Status404NotFound;
                    code = "NOT_FOUND";
                    message = exception.Message;
                    break;

                case ValidationException:
                    statusCode = StatusCodes.Status400BadRequest;
                    code = "VALIDATION_ERROR";
                    message = exception.Message;
                    break;

                case ConflictException:
                    statusCode = StatusCodes.Status409Conflict;
                    code = "CONFLICT";
                    message = exception.Message;
                    break;

                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    code = "INTERNAL_SERVER_ERROR";
                    message = "Ocorreu um erro interno no servidor.";

                    _logger.LogError(
                        exception,
                        "Erro não tratado durante o processamento da requisição."
                    );

                    break;
            }

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var response = new
            {
                status = statusCode,
                code,
                message,
                timestamp = DateTime.UtcNow,
                path = context.Request.Path.Value
            };

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}