using System;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;

        }

        [Authorize(Policy = "ModeratorRelicRole")]
        [HttpGet("relics-to-moderate")]
        public async Task<ActionResult> GetRelicForModeration()
        {
            var relics = await
                _unitOfWork.RelicRepository.GetUnapprovedRelics();
            return Ok(relics);
        }

        [Authorize(Policy = "ModeratorRelicRole")]
        [HttpGet("relics-to-reject")]
        public async Task<ActionResult> GetRelicReject()
        {
            var relics = await _unitOfWork.RelicRepository.GetRejectRelics();
            return Ok(relics);
        }


        [Authorize(Policy = "ModeratorRelicRole")]
        [HttpPost("approve-relic/{relicId}")]
        public async Task<ActionResult> ApproveRelic(int relicId)
        {
            var relic = await _unitOfWork.RelicRepository.GetRelicById(relicId);
            if (relic == null) return NotFound("Không tìm thấy bài viết!");
            
            relic.IsApproved = true;
            relic.IsReject = false;
            await _unitOfWork.Complete(); 
            return Ok();
        }

        [Authorize(Policy = "ModeratorRelicRole")]
        [HttpPost("reject-relic/{relicId}")]
        public async Task<ActionResult> RejectRelic(int relicId)
        {
            var relic = await _unitOfWork.RelicRepository.GetRelicById(relicId);
            if (relic == null) return NotFound("Không tìm thấy bài viết!");
            
            relic.IsApproved = false;
            relic.IsReject = true;
            await _unitOfWork.Complete(); 
            return Ok();
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("user-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);

        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRole(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null) return NotFound("Không tìm thấy tài khoản này!");

            var userRoles = await _userManager.GetRolesAsync(user);

            var resutl = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!resutl.Succeeded) return BadRequest("Lỗi khi chỉnh sửa quyền!");

            resutl = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!resutl.Succeeded) return BadRequest("Lỗi khi xóa quyền!");

            return Ok(await _userManager.GetRolesAsync(user));
        }

    }
}