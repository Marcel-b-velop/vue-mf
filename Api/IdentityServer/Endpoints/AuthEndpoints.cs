using System.Linq;
using System.Security.Claims;
using IdentityServer.Models;
using IdentityServer.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

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
            
            // Get application from configuration
            var configuration = app.Services.GetRequiredService<IConfiguration>();
            var application = configuration.GetSection("JwtSettings")["Application"] ?? "wichteln";
            
            return Results.Ok(new
            {
                id = identityUser.Id,
                email = identityUser.Email,
                userName = identityUser.UserName,
                roles = roles,
                application = application
            });
        })
        .WithName("GetCurrentUser")
        .WithTags("Identity")
        .RequireAuthorization()
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        // Admin endpoint to manage user roles
        identityApi.MapPost("/users/{userId}/roles", async (
            string userId,
            AssignRoleRequest request,
            ClaimsPrincipal currentUser,
            UserManager<IdentityUser> userManager) =>
        {
            // Check if current user is admin
            if (!currentUser.IsInRole("Admin"))
            {
                return Results.Json(new { message = "Nur Administratoren können Rollen verwalten." }, 
                    statusCode: StatusCodes.Status403Forbidden);
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Results.NotFound(new { message = "Benutzer nicht gefunden." });
            }

            if (request.Role != "Admin" && request.Role != "User")
            {
                return Results.BadRequest(new { message = "Ungültige Rolle. Nur 'Admin' und 'User' sind erlaubt." });
            }

            var currentRoles = await userManager.GetRolesAsync(user);
            
            if (request.Assign)
            {
                // Assign role if not already assigned
                if (!currentRoles.Contains(request.Role))
                {
                    var result = await userManager.AddToRoleAsync(user, request.Role);
                    if (!result.Succeeded)
                    {
                        return Results.BadRequest(new { 
                            message = "Rolle konnte nicht zugewiesen werden.", 
                            errors = result.Errors.Select(e => e.Description) 
                        });
                    }
                }
            }
            else
            {
                // Remove role if assigned
                if (currentRoles.Contains(request.Role))
                {
                    var result = await userManager.RemoveFromRoleAsync(user, request.Role);
                    if (!result.Succeeded)
                    {
                        return Results.BadRequest(new { 
                            message = "Rolle konnte nicht entfernt werden.", 
                            errors = result.Errors.Select(e => e.Description) 
                        });
                    }
                }
            }

            var updatedRoles = await userManager.GetRolesAsync(user);
            return Results.Ok(new { 
                userId = user.Id,
                email = user.Email,
                roles = updatedRoles 
            });
        })
        .WithName("AssignRole")
        .WithTags("Identity")
        .RequireAuthorization()
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status403Forbidden)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest);

        // Admin endpoint to list all users
        identityApi.MapGet("/users", async (
            ClaimsPrincipal currentUser,
            UserManager<IdentityUser> userManager) =>
        {
            // Check if current user is admin
            if (!currentUser.IsInRole("Admin"))
            {
                return Results.Json(new { message = "Nur Administratoren können alle Benutzer einsehen." }, 
                    statusCode: StatusCodes.Status403Forbidden);
            }

            // Get application from configuration
            var configuration = app.Services.GetRequiredService<IConfiguration>();
            var application = configuration.GetSection("JwtSettings")["Application"] ?? "wichteln";

            // Get all users
            var users = userManager.Users.ToList();
            var usersWithRoles = new List<object>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                usersWithRoles.Add(new
                {
                    id = user.Id,
                    email = user.Email,
                    userName = user.UserName,
                    roles = roles,
                    application = application,
                    emailConfirmed = user.EmailConfirmed,
                    lockoutEnabled = user.LockoutEnabled,
                    lockoutEnd = user.LockoutEnd
                });
            }

            return Results.Ok(new
            {
                total = usersWithRoles.Count,
                users = usersWithRoles
            });
        })
        .WithName("GetAllUsers")
        .WithTags("Identity")
        .RequireAuthorization()
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status403Forbidden)
        .Produces(StatusCodes.Status401Unauthorized);

        // Endpoint to create admin user directly
        identityApi.MapPost("/register-admin", async (
            RegisterRequest request,
            UserManager<IdentityUser> userManager,
            JwtTokenService tokenService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Results.BadRequest(new { message = "Email und Passwort sind erforderlich." });
            }

            // Validierung: Benutzername muss mindestens 2 Zeichen lang sein
            var userName = request.UserName ?? request.Email;
            if (userName.Length < 2)
            {
                return Results.BadRequest(new { message = "Der Benutzername muss mindestens 2 Zeichen lang sein." });
            }

            // Validierung: Passwort muss Zahlen und Buchstaben enthalten
            var hasDigit = request.Password.Any(char.IsDigit);
            var hasLetter = request.Password.Any(char.IsLetter);
            if (!hasDigit || !hasLetter)
            {
                return Results.BadRequest(new { message = "Das Passwort muss Zahlen und Buchstaben enthalten." });
            }

            var user = new IdentityUser
            {
                UserName = userName,
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

            // Assign Admin role directly
            await userManager.AddToRoleAsync(user, "Admin");

            var token = tokenService.GenerateToken(user, userManager);
            return Results.Ok(new AuthResponse(token, user.Email ?? "", user.Id));
        })
        .WithName("RegisterAdmin")
        .WithTags("Identity")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        identityApi.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "IdentityServer" }))
            .WithName("Health")
            .WithTags("Identity");
    }
}

