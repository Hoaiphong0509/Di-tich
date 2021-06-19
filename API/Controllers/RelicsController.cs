using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RelicsController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IRelicRepository _relicRepository;
        public RelicsController(IRelicRepository relicRepository, IMapper mapper)
        {
            _relicRepository = relicRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelics([FromQuery]PageParams pageParams)
        {
            var relics = await _relicRepository.GetRelicsAsync(pageParams);

            Response.AddPaginationHeader(relics.CurrentPage, relics.PageSize, relics.TotalCount, relics.TotalPages);
            
            return Ok(relics);
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelicsByName([FromQuery]PageParams pageParams, string name)
        {
            var relics = await _relicRepository.GetRelicsByNameAsync(pageParams, name);

            Response.AddPaginationHeader(relics.CurrentPage, relics.PageSize, relics.TotalCount, relics.TotalPages);
            
            return Ok(relics);
        }
    }
}