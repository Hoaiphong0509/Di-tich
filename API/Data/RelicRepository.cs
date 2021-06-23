using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class RelicRepository : IRelicRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        public RelicRepository(DataContext context, IMapper mapper, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _context = context;
        }
        public async Task<PageList<RelicDto>> GetRelicsByNameAsync(PageParams pageParams, string name)
        {
            var query = _context.Relics
                .Where(x => x.Name.ToLower().Contains(name)
                || x.NameUnmark.ToLower().Contains(name))
                .ProjectTo<RelicDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PageList<RelicDto>.CreateAsync(query, pageParams.PageNumber, pageParams.PageSize);
        }


        public async Task<PageList<RelicDto>> GetRelicsAsync(PageParams pageParams)
        {
            var query = _context.Relics
                .ProjectTo<RelicDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(r => r.View)
                .AsNoTracking();

            return await PageList<RelicDto>.CreateAsync(query, pageParams.PageNumber, pageParams.PageSize);
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Relic relic)
        {
            _context.Entry(relic).State = EntityState.Modified;
        }

        public async Task<int> CreateRelic(RelicCreateDto relicCreateDto)
        {
            var relic = new Relic();

            _mapper.Map(relicCreateDto, relic);
            _context.Relics.Add(relic);
            await _context.SaveChangesAsync();

            return relic.Id;
        }

        public async Task DeleteRelic(int id)
        {
            var relic = await _context.Relics.SingleOrDefaultAsync(r => r.Id == id);
            _context.Relics.Remove(relic);
        }

        public async Task<RelicDto> GetRelicDtoByIdAsync(int id)
        {
            var relic = await _context.Relics
                .Include(p => p.Photos)
                .ProjectTo<RelicDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == id);

            var relicFormData = await _context.Relics
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);

            relicFormData.View++;
            Update(relicFormData);
            
            await _context.SaveChangesAsync();

            return relic;
        }

        public async Task<Relic> GetRelicByIdAsync(int id)
        {
            var relic = await _context.Relics
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);
            return relic;
        }

        public async Task<int> UpdateRelic(RelicUpdateDto relicUpdateDto)
        {
            var relic = _context.Relics.SingleOrDefault(x => x.Id == relicUpdateDto.Id);

            _mapper.Map(relicUpdateDto, relic);

            await _context.SaveChangesAsync();

            return relic.Id;
        }

        public async Task<PageList<RelicDto>> GetRelicDtoByIdUserAsync(PageParams pageParams)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == pageParams.CurrentUsername);
            var query = _context.Relics
                .Where(r => r.AppUserId == user.Id)
                .ProjectTo<RelicDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(r => r.View)
                .AsNoTracking();

            return await PageList<RelicDto>.CreateAsync(query, pageParams.PageNumber, pageParams.PageSize);
        }
    }
}