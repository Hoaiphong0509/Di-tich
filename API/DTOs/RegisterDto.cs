using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Tài khoản không được trống")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được trống")]
        [StringLength(16, ErrorMessage = "Mật khẩu phải từ {2} đến {1} ký tự!", MinimumLength = 6)]
        public string Password { get; set; }
    }
}