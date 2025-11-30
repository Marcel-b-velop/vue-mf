using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Api.Tests;

public class IdentityServerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public IdentityServerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsHealthy()
    {
        // Act
        var response = await _client.GetAsync("/api/identity/health");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.Equal("healthy", content?.Status);
        Assert.Equal("IdentityServer", content?.Service);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsToken()
    {
        // Arrange
        var request = new
        {
            Email = $"test-{Guid.NewGuid()}@example.com",
            Password = "Test123!",
            UserName = "testuser"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/identity/register", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(content?.Token);
        Assert.Equal(request.Email, content?.Email);
    }

    [Fact]
    public async Task Register_WithInvalidPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new
        {
            Email = "test@example.com",
            Password = "weak", // Zu schwaches Passwort
            UserName = "testuser"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/identity/register", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var request = new
        {
            Email = "nonexistent@example.com",
            Password = "WrongPassword123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/identity/login", request);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/identity/me");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private record HealthResponse(string Status, string Service);
    private record AuthResponse(string Token, string Email, string UserId);
}

