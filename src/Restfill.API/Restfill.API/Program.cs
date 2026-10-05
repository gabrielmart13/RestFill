using Microsoft.EntityFrameworkCore;
using Restfill.API.Data;
using Restfill.API.Data.Repositories;
using Restfill.API.Data.Repositories.Interfaces;
using Restfill.API.Services;
using Restfill.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi


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



builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(
    options => options.UseMySQL(
        builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
