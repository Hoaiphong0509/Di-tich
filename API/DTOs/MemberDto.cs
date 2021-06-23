using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
    public class MemberDto
    {
        public string Username { get; set; }
        public string KnownAs { get; set; }
        public string Bio { get; set; }
        public string Address { get; set; }
        public string AvatarUrl { get; set; }
        public ICollection<RelicDto> Relics { get; set; }
    }
}