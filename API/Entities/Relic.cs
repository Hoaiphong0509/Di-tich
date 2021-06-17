using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using API.Extensions;

namespace API.Entities
{
    [Table("Relics")]
    public class Relic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameUnmark { get; set ; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int View { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public ICollection<Photo> Photos { get; set; }
    }
}