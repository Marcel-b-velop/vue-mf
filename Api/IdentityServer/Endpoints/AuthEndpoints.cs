using System.Security.Claims;
using IdentityServer.Models;
using IdentityServer.Services;
using Microsoft.AspNetCore.Identity;

namespace IdentityServer.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var identityApi = app.MapGroup("/api/identity");

        identityApi.MapPost("/register", async (
            RegisterRequest request,
            UserManager<IdentityUser> userManager,
            JwtTokenService tokenService) =>
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

            var token = tokenService.GenerateToken(user, userManager);
            return Results.Ok(new AuthResponse(token, user.Email ?? "", user.Id));
        })
        .WithName("Register")
        .WithTags("Identity")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        identityApi.MapPost("/login", async (
            LoginRequest request,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            JwtTokenService tokenService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Results.BadRequest(new { message = "Email und Passwort sind erforderlich." });
            }

            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Results.Json(new { message = "Ungültige E-Mail oder Passwort." }, statusCode: StatusCodes.Status401Unauthorized);
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
            if (!result.Succeeded)
            {
                return Results.Json(new { message = "Ungültige E-Mail oder Passwort." }, statusCode: StatusCodes.Status401Unauthorized);
            }

            var token = tokenService.GenerateToken(user, userManager);
            return Results.Ok(new AuthResponse(token, user.Email ?? "", user.Id));
        })
        .WithName("Login")
        .WithTags("Identity")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status400BadRequest);

        identityApi.MapGet("/me", async (
            ClaimsPrincipal user,
            UserManager<IdentityUser> userManager) =>
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
    }
}

