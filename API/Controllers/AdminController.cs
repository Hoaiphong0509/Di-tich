using System;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;

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

            if(user is null) return NotFound("Không tìm thấy tài khoản này!");

            var userRoles = await _userManager.GetRolesAsync(user);

            var resutl = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!resutl.Succeeded) return BadRequest("Lỗi khi chỉnh sửa quyền!");

            resutl = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!resutl.Succeeded) return BadRequest("Lỗi khi xóa quyền!");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratorRelicRole")]
        [HttpGet("relic-to-moderate")]
        public ActionResult GetRelicForModeration()
        {
            return Ok("Vung admin va moderator");
        }
    }
}