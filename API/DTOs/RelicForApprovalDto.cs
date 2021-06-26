namespace API.DTOs
{
    public class RelicForApprovalDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
        public bool IsApproved { get; set; }
        public bool IsReject { get; set; }
    }
}