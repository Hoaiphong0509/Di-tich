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
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(
                    src => src.Avatar.FirstOrDefault(x => x.IsMain).Url
                ));
            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<Photo, PhotoDto>();
            CreateMap<Avatar, AvatarDto>();

            CreateMap<Relic, RelicDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(x => x.IsMain == true).Url))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(
                    src => src.AppUser.KnownAs
                ));
            CreateMap<RelicUpdateDto, Relic>()
                .ForMember(dest => dest.NameUnmark, opt => opt.MapFrom(
                    src => src.Name.ConvertToUnSign()));
            CreateMap<RelicCreateDto, Relic>()
                .ForMember(dest => dest.NameUnmark, opt => opt.MapFrom(
                    src => src.Name.ConvertToUnSign()));
            CreateMap<RelicDto, Relic>();
           

        }
    }
}