using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
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
        public async Task<IEnumerable<RelicDto>> GetRelicsByNameAsync(string name)
        {
            return await _context.Relics
                .Where(x => x.Name.ToLower().Contains(name)
                || x.NameUnmark.ToLower().Contains(name))
                .ProjectTo<RelicDto>(_mapper.ConfigurationProvider)
                .ToListAsync();


        }


        public async Task<IEnumerable<RelicDto>> GetRelicsAsync()
        {
            return await _context.Relics
                .ProjectTo<RelicDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Relic relic)
        {
            _context.Entry(relic).State = EntityState.Modified;
        }

        public void CreateRelic(RelicCreateDto relicCreateDto)
        {
            var relic = new Relic();

            _mapper.Map(relicCreateDto, relic);

            _context.Relics.Add(relic);
        }

        public async Task DeleteRelic(int id)
        {
            var relic = await _context.Relics.SingleOrDefaultAsync(r => r.Id == id);
            _context.Relics.Remove(relic);
        }

        public async Task<Relic> GetRelicByIdAsync(int id)
        {
            return await _context.Relics
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}