using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class RelicDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int View { get; set; }
        public string PhotoUrl { get; set; }
        public DateTime Created { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}