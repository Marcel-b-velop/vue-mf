using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;

namespace Api.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
    {
        // Endpoints API Explorer für Minimal APIs
        services.AddEndpointsApiExplorer();
        
        services.AddOpenApiDocument(document =>
        {
            document.Title = "Wichteln API";
            document.Version = "v1";
            document.Description = "API für die Wichteln-Anwendung";

            // JWT Authentication in Swagger
            document.AddSecurity("Bearer", new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.\n\nExample: \"Bearer 12345abcdef\""
            });

            // Automatisch Security-Anforderungen für alle Endpunkte mit [Authorize] hinzufügen
            document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("Bearer"));
        });

        return services;
    }
}


