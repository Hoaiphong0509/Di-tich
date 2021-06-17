using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class Relic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int View { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public ICollection<Photo> Photos { get; set; }
    }
}