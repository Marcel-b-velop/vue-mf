using IdentityServer.Endpoints;
using IdentityServer.Extensions;
using IdentityServer.Services;

var builder = WebApplication.CreateBuilder(args);

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
