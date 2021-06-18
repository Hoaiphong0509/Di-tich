using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperData : Profile
    {
        public AutoMapperData()
        {
            CreateMap<AppUser, MemberDto>();
            CreateMap<Relic, RelicDto>()
                .ForMember
                (
                    dest => dest.PhotoUrl, opt => opt.MapFrom
                    (
                        src => src.Photos.FirstOrDefault(x => x.IsMain == true).Url
                    )
                );
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
        }
    }
}