using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IdentityServer.Data;
using IdentityServer.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("IdentityDb"));

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    
    // SignIn settings
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "IdentityServer",
        ValidAudience = jwtSettings["Audience"] ?? "VueApp",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    
    context.Database.EnsureCreated();
    
    // Create default roles
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
    if (!await roleManager.RoleExistsAsync("User"))
    {
        await roleManager.CreateAsync(new IdentityRole("User"));
    }
}

// Helper method to generate JWT token
string GenerateJwtToken(IdentityUser user, IConfiguration configuration)
{
    var jwtSettings = configuration.GetSection("JwtSettings");
    var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
    var issuer = jwtSettings["Issuer"] ?? "IdentityServer";
    var audience = jwtSettings["Audience"] ?? "VueApp";
    var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"] ?? "60");

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email ?? ""),
        new Claim(ClaimTypes.Name, user.UserName ?? ""),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Identity Endpoints
var identityApi = app.MapGroup("/api/identity");

identityApi.MapPost("/register", async (RegisterRequest request, UserManager<IdentityUser> userManager, IConfiguration configuration) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { message = "Email und Passwort sind erforderlich." });
    }

    var user = new IdentityUser
    {
        UserName = request.UserName ?? request.Email,
        Email = request.Email
    };

    var result = await userManager.CreateAsync(user, request.Password);

    if (!result.Succeeded)
    {
        return Results.BadRequest(new { 
            message = "Registrierung fehlgeschlagen.", 
            errors = result.Errors.Select(e => e.Description) 
        });
    }

    // Assign default role
    await userManager.AddToRoleAsync(user, "User");

    var token = GenerateJwtToken(user, configuration);
    return Results.Ok(new AuthResponse(token, user.Email ?? "", user.Id));
})
.WithName("Register")
.WithTags("Identity")
.Produces<AuthResponse>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status400BadRequest);

identityApi.MapPost("/login", async (LoginRequest request, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { message = "Email und Passwort sind erforderlich." });
    }

    var user = await userManager.FindByEmailAsync(request.Email);
    if (user == null)
    {
        return Results.Json(new { message = "Ungültige E-Mail oder Passwort." }, statusCode: 401);
    }

    var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
    if (!result.Succeeded)
    {
        return Results.Json(new { message = "Ungültige E-Mail oder Passwort." }, statusCode: 401);
    }

    var token = GenerateJwtToken(user, configuration);
    return Results.Ok(new AuthResponse(token, user.Email ?? "", user.Id));
})
.WithName("Login")
.WithTags("Identity")
.Produces<AuthResponse>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status401Unauthorized)
.Produces(StatusCodes.Status400BadRequest);

identityApi.MapGet("/me", async (ClaimsPrincipal user, UserManager<IdentityUser> userManager) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
    {
        return Results.Unauthorized();
    }

    var identityUser = await userManager.FindByIdAsync(userId);
    if (identityUser == null)
    {
        return Results.NotFound();
    }

    var roles = await userManager.GetRolesAsync(identityUser);
    
    return Results.Ok(new
    {
        id = identityUser.Id,
        email = identityUser.Email,
        userName = identityUser.UserName,
        roles = roles
    });
})
.WithName("GetCurrentUser")
.WithTags("Identity")
.RequireAuthorization()
.Produces(StatusCodes.Status200OK)
.Produces(StatusCodes.Status401Unauthorized);

identityApi.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "IdentityServer" }))
    .WithName("Health")
    .WithTags("Identity");

app.Run();
