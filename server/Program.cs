using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Auth;
using Server.Data;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

string connectionString = builder.Configuration.GetConnectionString("BuildBattleConStr");

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(connectionString));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => opt.TokenValidationParameters = AuthHelper.TokenValidationParameters);

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.

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

    return Results.Ok(AuthHelper.CreateToken(user.Login));
});

AppDbContext.Refresh(connectionString);
AppDbContext.Fill(connectionString);

app.Run();

record SignInData(string login, string password);