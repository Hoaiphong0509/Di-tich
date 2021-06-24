using System.Threading.Tasks;
namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get; }
        IRelicRepository RelicRepository {get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}