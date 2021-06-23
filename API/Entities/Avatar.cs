using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Avatar")]
    public class Avatar
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public bool IsMain { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}