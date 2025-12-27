using System.Security.Claims;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Gruppen")]
[Authorize(Policy = "AdminOnly")]
public class GruppenController : ControllerBase
{
    private readonly WichtelnDbContext _dbContext;

    public GruppenController(WichtelnDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Erstellt eine neue Gruppe (nur für Administratoren)
    /// </summary>
    /// <param name="request">Die Gruppen-Daten als Base64-String</param>
    /// <returns>Die erstellte Gruppe mit ID</returns>
    /// <response code="200">Gruppe erfolgreich erstellt</response>
    /// <response code="400">Ungültige Anfrage</response>
    /// <response code="401">Nicht authentifiziert</response>
    /// <response code="403">Keine Berechtigung (nur Administratoren)</response>
    [HttpPost]
    [ProducesResponseType(typeof(CreateGruppeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateGruppe([FromBody] CreateGruppeRequest request)
    {
        // Validate base64 string
        if (string.IsNullOrWhiteSpace(request.Grp))
        {
            return BadRequest(new { message = "Grp darf nicht leer sein." });
        }

        // Try to decode base64 to validate it
        try
        {
            Convert.FromBase64String(request.Grp);
        }
        catch (FormatException)
        {
            return BadRequest(new { message = "Grp muss eine gültige Base64-Zeichenkette sein." });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var gruppe = new Gruppe
        {
            GrpBase64 = request.Grp,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Gruppen.Add(gruppe);
        await _dbContext.SaveChangesAsync();

        return Ok(new CreateGruppeResponse
        {
            Id = gruppe.Id,
            Message = "Gruppe erfolgreich erstellt."
        });
    }
}

public class CreateGruppeResponse
{
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
}

