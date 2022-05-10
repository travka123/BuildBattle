using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

[Index(nameof(Login), IsUnique = true)]
public class User {

    [Key]
    public int Id { get; set; }

    public string Login { get; set; } = null!;

    public string Password { get; set; } = null!;
}

