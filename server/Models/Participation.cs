using System.ComponentModel.DataAnnotations;

namespace Server.Models {
    public class Participation {

        [Key]
        public int Id { get; set; }

        public Match match { get; set; } = null!;

        public User user { get; set; } = null!;

        public bool isWinner { get; set; }
    }
}
