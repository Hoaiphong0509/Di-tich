using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] PageParams pageParams)
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

        [HttpPost("add-avatar")]
        public async Task<ActionResult<AvatarDto>> AddAvatar(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user is null) return BadRequest("Lỗi khi tải ảnh");

             if (user.Avatar.Count >= 1)
            {
                foreach (var avt in user.Avatar)
                {
                    await DeleteAvatar(avt.Id);
                }
            }
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var avatar = new Avatar
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = true
            };

            user.Avatar.Add(avatar);

            if (await _userRepository.SaveAllAsync())
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<AvatarDto>(avatar));

            return BadRequest("Lỗi tải ảnh!");
        }

        [HttpDelete("delete-avatar")]
        public async Task<ActionResult> DeleteAvatar([FromQuery] int avatarId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var avt = user.Avatar.FirstOrDefault(p => p.Id == avatarId);

            if (avt == null) return NotFound();

            if (avt.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(avt.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Avatar.Remove(avt);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("LỖi khi đang xóa ảnh!");
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

        [HttpGet("get-relics-by-user")]
        public async Task<ActionResult<IEnumerable<RelicDto>>> GetRelicByIdUser([FromQuery] PageParams pageParams)
        {

            var relics = await _relicRepository.GetRelicDtoByIdUserAsync(pageParams);
            Response.AddPaginationHeader(relics.CurrentPage, relics.PageSize, relics.TotalCount, relics.TotalPages);

            return Ok(relics);
        }


        [HttpPost("add-relic")]
        public async Task<ActionResult<RelicDto>> CreateRelic(RelicCreateDto relicCreateDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            relicCreateDto.AppUserId = user.Id;
            var relicId = await _relicRepository.CreateRelic(relicCreateDto);

            return new RelicDto
            {
                Id = relicId,
                Name = relicCreateDto.Name,
                Title = relicCreateDto.Title,
                Content = relicCreateDto.Content,
                Author = (user.KnownAs is null) ? user.UserName : user.KnownAs
            };
            // return BadRequest("failed");
        }

        [HttpDelete("delete-relic/{id}")]
        public async Task<ActionResult> DeleteRelic(int id)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(id);

            foreach (var photo in relic.Photos)
            {
                await DeleteAllPhoto(id, photo.Id);
            }
            await _relicRepository.DeleteRelic(id);
            if (await _relicRepository.SaveAllAsync()) return Ok();
            return BadRequest("Xóa di tích thất bại!");
        }

        [HttpPut("edit-relic")]
        public async Task<ActionResult<RelicDto>> UpdateRelic(RelicUpdateDto relicUpdateDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var relic = await _relicRepository.GetRelicByIdAsync(relicUpdateDto.Id);

            _mapper.Map(relicUpdateDto, relic);

            var relicId = await _relicRepository.UpdateRelic(relicUpdateDto);

            return new RelicDto
            {
                Id = relicId,
                Name = relicUpdateDto.Name,
                Title = relicUpdateDto.Title,
                Content = relicUpdateDto.Content,
                Author = (user.KnownAs is null) ? user.UserName : user.KnownAs
            };
            // return BadRequest("Cập nhật thông tin thất bại!");
        }

        [HttpPost("add-photo-relic/{id}")]
        public async Task<ActionResult<PhotoDto>> AddPhotoRelic(int id, IFormFile file)
        {
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
        public async Task<ActionResult> SetMainPhoto([FromQuery] int relicId, [FromQuery] int photoId)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(relicId);

            var photo = relic.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo.IsMain) return BadRequest("Hình này hiện tại đang là ảnh bìa !");

            var currentMain = relic.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Lỗi khi đang đặt ảnh làm ảnh chính!");
        }

        [HttpDelete("delete-photo")]
        public async Task<ActionResult> DeletePhoto([FromQuery] int relicId, [FromQuery] int photoId)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(relicId);

            var photo = relic.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound();

            if (relic.Photos.Count > 1)
            {
                if (photo.IsMain) return BadRequest("Bạn không thể xóa ảnh chính của di tích!");
            }

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            relic.Photos.Remove(photo);

            if (await _relicRepository.SaveAllAsync()) return Ok();

            return BadRequest("LỖi khi đang xóa ảnh!");
        }

        private async Task<ActionResult> DeleteAllPhoto([FromQuery] int relicId, [FromQuery] int photoId)
        {
            var relic = await _relicRepository.GetRelicByIdAsync(relicId);

            var photo = relic.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            relic.Photos.Remove(photo);

            if (await _relicRepository.SaveAllAsync())
                return Ok();
            return BadRequest("Lỗi khi xóa tất cả ảnh!");
        }

        #endregion
    }


}