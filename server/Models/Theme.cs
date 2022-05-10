using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

[Index(nameof(Name), IsUnique = true)]
public class Theme {

    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}

