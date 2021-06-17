using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using API.DTOs;
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
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelics()
        {
            return Ok(await _relicRepository.GetRelicsAsync());
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelicsByName(string name)
        {
            return Ok(await _relicRepository.GetRelicsByNameAsync(name));
        }
    }
}