namespace IdentityServer.Models;

public record RegisterRequest(string Email, string Password, string? UserName = null);

