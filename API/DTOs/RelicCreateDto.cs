namespace API.DTOs
{
    public class RelicCreateDto
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int AppUserId { get; set; }
    }
}