namespace Restfill.API.Data.Repositories.Interfaces
{
    public interface IGeralRepo
    {

        //O geral repo e um repositorio generico, feito para aceitar qualquer tipo de entidade
        // O T e um tipo generico, e o where : class faz o T ser uma classe, e nao um tipo primitivo
        Task<T?> Pegar<T>(int id) where T : class;
        Task<IEnumerable<T>> PegarTodos<T>() where T : class;
        Task<T> Adicionar<T>(T entity) where T : class;
        Task<T> Atualizar<T>(T entity) where T : class;
        Task<T> Remover<T>(T entity) where T : class;
        Task<bool> SalvarMudancasAsync();

    }
}
