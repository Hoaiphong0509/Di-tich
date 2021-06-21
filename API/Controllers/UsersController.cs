using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using API.Extensions;
using API.Helpers;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IRelicRepository _relicRepository;
        public UsersController(IRelicRepository relicRepository, IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _relicRepository = relicRepository;
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        // =====================
        // User
        // =====================
        #region User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]PageParams pageParams)
        {
            pageParams.CurrentUsername = User.GetUsername();
            var users = await _userRepository.GetMembersAsync(pageParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);

        }

        [HttpGet("get-user-by-id/{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Cập nhật thông tin thất bại!");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var avt = result.SecureUrl.AbsoluteUri;

            user.Avatar = avt;

            if (await _userRepository.SaveAllAsync())
            {
                // return CreatedAtRoute("GetUser", new {username = user.UserName});
                return Ok();
            }

            return BadRequest("Lỗi tải ảnh!");
        }
        #endregion


        // =====================
        // Relic
        // =====================
        #region Relic

       [HttpGet("get-relic-by-id/{id}", Name = "GetRelic")]
        public async Task<RelicDto> GetRelic(int id)
        {
            return await _relicRepository.GetRelicDtoByIdAsync(id);
        }


        [HttpPost("add-relic")]
        public async Task<ActionResult> CreateRelic(RelicCreateDto relicCreateDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            relicCreateDto.AppUserId = user.Id;
            _relicRepository.CreateRelic(relicCreateDto);

            if (await _relicRepository.SaveAllAsync()) return Ok();

            return BadRequest("failed");
        }

        [HttpDelete("delete-relic/{id}")]
        public async Task<ActionResult> DeleteRelic(int id)
        {
            await _relicRepository.DeleteRelic(id);
            if (await _relicRepository.SaveAllAsync()) return Ok();
            return BadRequest("Xóa di tích thất bại!");
        }

        [HttpPut("edit-relic/{id}")]
        public async Task<ActionResult> UpdateRelic(int id, [FromBody] RelicUpdateDto relicUpdateDto)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(id);

            _mapper.Map(relicUpdateDto, relic);

            _relicRepository.Update(relic);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Cập nhật thông tin thất bại!");
        }

        [HttpPost("add-photo-relic/{id}")]
        public async Task<ActionResult<PhotoDto>> AddPhotoRelic(int id, IFormFile file)
        {
            // var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var relic = await _relicRepository.GetRelicByIdAsync(id);

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (relic.Photos.Count == 0 || relic.Photos == null)
            {
                photo.IsMain = true;
            }

            relic.Photos.Add(photo);

            if (await _relicRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetRelic", new { id = relic.Id }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Lỗi tải ảnh!");
        }

        [HttpPut("set-main-photo")]
        public async Task<ActionResult> SetMainPhoto([FromQuery]int relicId, [FromQuery]int photoId)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(relicId);

            var photo = relic.Photos.FirstOrDefault(p => p.Id == photoId);

            if(photo.IsMain) return BadRequest("Hình này hiện tại đang là ảnh bìa !");

            var currentMain = relic.Photos.FirstOrDefault(p => p.IsMain);
            if(currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Lỗi khi đang đặt ảnh làm ảnh chính!");
        }

        [HttpDelete("delete-photo")]
        public async Task<ActionResult> DeletePhoto([FromQuery]int relicId, [FromQuery]int photoId)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(relicId);

            var photo = relic.Photos.FirstOrDefault(p => p.Id == photoId);

            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("Bạn không thể xóa ảnh chính của di tích!");

            if(photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            relic.Photos.Remove(photo);

            if(await _relicRepository.SaveAllAsync()) return Ok();

            return BadRequest("LỖi khi đang xóa ảnh!");
        }

        #endregion
    }


}