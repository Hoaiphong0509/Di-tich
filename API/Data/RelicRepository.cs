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
        public RelicRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        public async Task<IEnumerable<RelicDto>> GetRelicsByNameAsync(string name)
        {
            return await _context.Relics
                .Where(x => x.Name.ToLower().Contains(name) 
                ||x.NameUnmark.ToLower().Contains(name))
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
    }
}