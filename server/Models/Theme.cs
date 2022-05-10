using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Theme {

    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}

