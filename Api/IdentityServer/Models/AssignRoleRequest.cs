namespace IdentityServer.Models;

public record AssignRoleRequest(string Role, bool Assign = true);

