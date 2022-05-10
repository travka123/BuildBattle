using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public class AppDbContext : DbContext {

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Theme> Themes { get; set; } = null!;
    public DbSet<Participation> Participations { get; set; } = null!;
    public DbSet<Match> Matchs { get; set; } = null!;

    public AppDbContext(DbContextOptions options) : base(options) { }

    public static void Refresh(string connectionString) {

        var optb = new DbContextOptionsBuilder<AppDbContext>();
        optb.UseSqlServer(connectionString);
        using (var db = new AppDbContext(optb.Options)) {

            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
        }
    }

    public static void Fill(string connectionString) {

        var optb = new DbContextOptionsBuilder<AppDbContext>();
        optb.UseSqlServer(connectionString);
        using (var db = new AppDbContext(optb.Options)) {

            db.Users.Add(new User() { Login = "user123", Password = "123" });
            db.Users.Add(new User() { Login = "user222", Password = "222" });

            db.Themes.Add(new Theme() { Name = "House" });
            db.Themes.Add(new Theme() { Name = "Plane" });

            db.SaveChanges();
        }
    }
}

