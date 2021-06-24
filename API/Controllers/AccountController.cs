using System.Linq;
using System;
using System.Text;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper)
        {
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(u => u.Avatar)
                .SingleOrDefaultAsync(u => u.UserName == loginDto.Username.ToLower());

            if (user is null) return Unauthorized("Tài khoản không đúng!");

            var result = await _signInManager
                .CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized("Mật khẩu không đúng!");

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                AvatarUrl = user.Avatar.FirstOrDefault(x => x.IsMain)?.Url,
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Tài khoản đã tồn tại!");

            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(u => u.UserName == username.ToLower());
        }

        #region Chưa triển khai tính năng đôi username & passowrd
        // [Authorize]
        // [HttpPut("change-username")]
        // public async Task<ActionResult<UserDto>> ChangeUsername(AccountUpdateDto accountUpdateDto)
        // {
        //     if (await UserExists(accountUpdateDto.Username))
        //         return BadRequest("Tài khoản đã tồn tại");

        //     var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //     var user = await _userRepository.GetUserByUsernameAsync(username);
        //     var old = _userManager.RemovePasswordAsync(user);

        //     user.UserName = accountUpdateDto.Username;
        //     var result = _userManager.AddPasswordAsync(user, accountUpdateDto.Password);

        //     // if (!result.) return BadRequest(result.Errors);
        //     await _userManager.UpdateAsync(user);

        //     return new UserDto
        //     {
        //         Username = user.UserName,
        //         Token = await _tokenService.CreateToken(user),
        //         AvatarUrl = user.Avatar.FirstOrDefault(x => x.IsMain)?.Url,
        //     };
        // }

        // [Authorize]
        // [HttpPut("change-password")]
        // public async Task<ActionResult> changePassword(ChangePasswordDto changePasswordDto)
        // {
        //     var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //     var user = await _userRepository.GetUserByUsernameAsync(username);

        //     if (user == null)
        //     {
        //         return NotFound();
        //     }
        //     var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        //     var result = await _userManager.ResetPasswordAsync(user, token, changePasswordDto.Password);
        //     // var p = _userManager.PasswordHasher.HashPassword("dqwdq");
        //     // user.PasswordHash = _userManager.PasswordHasher.HashPassword("Pas");
        //     // var result = await _userManager.UpdateAsync(user);
        //     // if (!result.Succeeded)
        //     // {
        //     //     //throw exception......
        //     // }
        //     return Ok();
        // }
        #endregion

    }
}