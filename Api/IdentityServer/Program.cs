using System.Security.Authentication;
using IdentityServer.Endpoints;
using IdentityServer.Extensions;
using IdentityServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel for HTTPS with development certificate
builder.WebHost.ConfigureKestrel(options =>
{
    options.ConfigureHttpsDefaults(httpsOptions =>
    {
        // Allow TLS 1.2 and 1.3 for better browser compatibility
        httpsOptions.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
        // Use default certificate selection (development certificate)
    });
});

// Add services
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddApiServices();
builder.Services.AddCorsServices();
builder.Services.AddScoped<JwtTokenService>();

var app = builder.Build();

// Configure pipeline
app.ConfigurePipeline();

// Initialize database
await app.InitializeDatabaseAsync();

// Map endpoints
app.MapAuthEndpoints();

app.Run();

// Für WebApplicationFactory in Tests
public partial class Program { }
