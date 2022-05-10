using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Auth;
using Server.Data;
using Server.Models;
using Server.Game;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("BuildBattleConStr");

// Add services to the container.

builder.Services.AddCors();

builder.Services.AddSignalR(opt => opt.EnableDetailedErrors = true);

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(connectionString));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer((opt) => {

        opt.TokenValidationParameters = AuthHelper.TokenValidationParameters;
        opt.Events = new JwtBearerEvents() {
            OnMessageReceived = (context) => {

                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken)) {

                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IGameMessageQueue, GameMessageQueue>();

builder.Services.AddHostedService<GameService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(builder => builder.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapGet("/userinfo", [Authorize] async (ClaimsPrincipal claimsPrincipal, [FromServices] AppDbContext dbContext) => {

    var identity = (claimsPrincipal.Identity as ClaimsIdentity)!;

    var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Login == identity.Name);

    if (user is null) {

        return Results.Conflict();
    }

    return Results.Ok(new {Login = user.Login});
});

app.MapPost("/signin", async ([FromBody] SignInData signInData, [FromServices] AppDbContext dbContext) => {

    var user = await dbContext.Users.SingleOrDefaultAsync((u) => (u.Login == signInData.login) && (u.Password == signInData.password));

    if (user is null) {

        return Results.Unauthorized();
    }

    return Results.Ok(new { jwt = AuthHelper.CreateToken(user.Login) });
});

app.MapPost("/signup", async ([FromBody] SignUpData signUpData, [FromServices] AppDbContext dbContext) => {

    if ((signUpData.login.Length <= 3) || 
        (signUpData.password.Length <= 3)) {

        return Results.BadRequest();
    }

    var user = new User() { 
        Login = signUpData.login,
        Password = signUpData.password,
    };

    try {

        dbContext.Add(user);
        await dbContext.SaveChangesAsync();
    } 
    catch (DbUpdateException) {

        return Results.Conflict();
    }

    return Results.Ok(new { jwt = AuthHelper.CreateToken(user.Login) });
});

app.MapGet("/stats", [Authorize] async (ClaimsPrincipal claimsPrincipal, [FromServices] AppDbContext dbContext) => {

    var identity = (claimsPrincipal.Identity as ClaimsIdentity)!;

    var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Login == identity.Name);

    if (user is null) {

        return Results.Conflict();
    }

    var participatons = await dbContext.Participations.Where(p => p.user == user).Include(p => p.match).ToListAsync();

    var totalPlayed = participatons.Count;
    var totalWins = participatons.Where(p => p.isWinner).Count();

    return Results.Ok(new { played = totalPlayed, wins = totalWins });
});

app.MapHub<GameHub>("/game");

AppDbContext.Refresh(connectionString);
AppDbContext.Fill(connectionString);

app.Run();

record SignInData(string login, string password);
record SignUpData(string login, string password);