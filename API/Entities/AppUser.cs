using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string KnownAs { get; set; }
        public string Bio { get; set; }
        public string Address { get; set; }
        public ICollection<Avatar> Avatar { get; set; }
        public ICollection<Relic> Relics { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}