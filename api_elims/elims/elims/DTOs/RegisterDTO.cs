using System.ComponentModel.DataAnnotations;

namespace elims.DTOs
{
    public class RegisterDTO
    {
        public int ForwarderId { get; set; }
        //public string Name { get; set; }

        public string? Code { get; set; }

        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
