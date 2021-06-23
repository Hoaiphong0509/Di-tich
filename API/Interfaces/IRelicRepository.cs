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
        Task<PageList<RelicDto>> GetRelicDtoByIdUserAsync(PageParams pageParams);
        Task<Relic> GetRelicByIdAsync(int id);
        Task<int> CreateRelic(RelicCreateDto relicCreateDto);
        Task<int> UpdateRelic(RelicUpdateDto relicUpdateDto);
        Task DeleteRelic(int id);
    }
}