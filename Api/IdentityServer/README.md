# IdentityServer

Ein IdentityServer-Projekt für die Benutzeranmeldung und -verwaltung mit ASP.NET Core Identity und JWT-Authentifizierung.

## Features

- **Benutzerregistrierung**: Neue Benutzer können sich registrieren
- **Benutzeranmeldung**: Authentifizierung mit Email und Passwort
- **JWT-Token**: Generierung von JWT-Tokens für die API-Authentifizierung
- **Rollenverwaltung**: Unterstützung für Benutzerrollen (Admin, User)
- **Swagger UI**: API-Dokumentation unter `/swagger`

## Endpunkte

### POST /api/identity/register
Registriert einen neuen Benutzer.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "userName": "optional-username"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": "user-id-guid"
}
```

### POST /api/identity/login
Meldet einen Benutzer an.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": "user-id-guid"
}
```

### GET /api/identity/me
Ruft Informationen über den aktuell angemeldeten Benutzer ab. Erfordert Authentifizierung.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user-id-guid",
  "email": "user@example.com",
  "userName": "username",
  "roles": ["User"]
}
```

### GET /api/identity/health
Health-Check-Endpunkt.

## Konfiguration

Die JWT-Einstellungen können in `appsettings.json` konfiguriert werden:

```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!",
    "Issuer": "IdentityServer",
    "Audience": "VueApp",
    "ExpiryMinutes": "60"
  }
}
```

## Passwort-Anforderungen

- Mindestens 6 Zeichen
- Mindestens eine Ziffer
- Mindestens ein Kleinbuchstabe
- Mindestens ein Großbuchstabe

## Datenbank

Die Anwendung verwendet aktuell eine In-Memory-Datenbank für Entwicklung. Für Produktion sollte eine persistente Datenbank (z.B. SQL Server, PostgreSQL) verwendet werden.

## Ausführen

```bash
cd IdentityServer
dotnet run
```

Die API ist dann unter `http://localhost:5283` verfügbar.
Swagger UI: `http://localhost:5283/swagger`

## Integration mit Vue-App

Um den Token in der Vue-App zu verwenden:

1. Nach erfolgreichem Login/Register den Token im localStorage speichern
2. Bei API-Requests den Token im Authorization-Header mitsenden:
   ```
   Authorization: Bearer {token}
   ```

