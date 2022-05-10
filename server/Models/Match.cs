using System.ComponentModel.DataAnnotations;

namespace Server.Models {
    public class Match {

        [Key]
        public int Id { get; set; }

        public Theme Theme { get; set; } = null!;

        public DateTime Date { get; set; }
    }
}
