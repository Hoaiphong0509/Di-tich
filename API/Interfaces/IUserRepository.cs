using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<PageList<MemberDto>> GetMembersAsync(PageParams pageParams);
        Task<MemberDto> GetMemberAsync(string username, bool isCurrentUser);
        Task<AppUser> GetUserByRelicId(int photoId);
    }
}