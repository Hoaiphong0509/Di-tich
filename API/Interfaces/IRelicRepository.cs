using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IRelicRepository
    {
        void Update(Relic relic);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<RelicDto>> GetRelicsAsync();
        Task<IEnumerable<RelicDto>> GetRelicsByNameAsync(string name);
        Task<Relic> GetRelicByIdAsync(int id);
        void CreateRelic(RelicCreateDto relicCreateDto);
        Task DeleteRelic(int id);
    }
}