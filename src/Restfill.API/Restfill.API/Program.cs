using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Middleware;
using Restfill.API.Services;
using Restfill.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Repository
builder.Services.AddScoped<IGeralRepo, GeralRepo>();

// Services
builder.Services.AddScoped<ICardapioService, CardapioService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IGerenteService, GerenteService>();
builder.Services.AddScoped<IIngredienteService, IngredienteService>();
builder.Services.AddScoped<IItemCardapioService, ItemCardapioService>();
builder.Services.AddScoped<IMovimentacaoService, MovimentacaoService>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<IRefeicaoService, RefeicaoService>();
builder.Services.AddScoped<IUnidadeMedidaService, UnidadeMedidaService>();

// Swagger
builder.Services.AddSwaggerGen();

// Banco de dados
builder.Services.AddDbContext<DataContext>(
    options => options.UseMySQL(
        builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

// Middleware global de exceções
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS
app.UseCors("Frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();