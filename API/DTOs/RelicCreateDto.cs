using System.Collections;
using System.Collections.Generic;
using API.Entities;
using Microsoft.AspNetCore.Http;

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