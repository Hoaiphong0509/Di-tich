using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IRelicRepository
    {
       void Update(Relic relic);
        Task<bool> SaveAllAsync();
        Task<PageList<RelicDto>> GetRelicsAsync(PageParams pageParams);
        Task<PageList<RelicDto>> GetRelicsByNameAsync(PageParams pageParams, string name);
        Task<RelicDto> GetRelicDtoByIdAsync(int id);
        Task<Relic> GetRelicByIdAsync(int id);
        void CreateRelic(RelicCreateDto relicCreateDto);
        Task DeleteRelic(int id);
    }
}