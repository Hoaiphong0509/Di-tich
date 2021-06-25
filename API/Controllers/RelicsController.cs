using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RelicsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public RelicsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelics([FromQuery] PageParams pageParams)
        {
            var relics = await _unitOfWork.RelicRepository.GetRelicsAsync(pageParams);

            Response.AddPaginationHeader(relics.CurrentPage, relics.PageSize, relics.TotalCount, relics.TotalPages);

            return Ok(relics);
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelicsByName([FromQuery] PageParams pageParams, string name)
        {
            var relics = await _unitOfWork.RelicRepository.GetRelicsByNameAsync(pageParams, name.ToLower().ConvertToUnSign());

            Response.AddPaginationHeader(relics.CurrentPage, relics.PageSize, relics.TotalCount, relics.TotalPages);

            return Ok(relics);
        }

        [Authorize]
        [HttpGet("get-relic-by-username")]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelicByUsername([FromQuery] PageParams pageParams, string username, string name)
        {
            var relics = await _unitOfWork.RelicRepository.GetRelicDtoByUsername(pageParams, username.ToLower(), name.ToLower().ConvertToUnSign());

            Response.AddPaginationHeader(relics.CurrentPage, relics.PageSize, relics.TotalCount, relics.TotalPages);

            return Ok(relics);
        }

        [HttpGet("get-relic-by-id/{id}")]
        public async Task<ActionResult<RelicDto>> GetRelicsById(int id)
        {
            var relics = await _unitOfWork.RelicRepository.GetRelicDtoByIdAsync(id);

            return relics;
        }
    }
}