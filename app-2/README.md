# App 2 - Authentifizierung

Ein Vue.js-Modul für die Benutzerauthentifizierung mit Login, Registrierung und Logout-Funktionalität.

## Features

- **Login**: Benutzeranmeldung mit E-Mail und Passwort
- **Registrierung**: Neue Benutzer können sich registrieren
- **Logout**: Abmeldung und Token-Entfernung
- **JWT-Token-Verwaltung**: Automatische Token-Speicherung und -Verwendung
- **Auth-State-Management**: Pinia Store für Authentifizierungsstatus
- **Module Federation**: Kann als Remote-Modul in andere Apps geladen werden

## Integration mit IdentityServer

Die App kommuniziert mit dem IdentityServer unter `http://localhost:5283/api/identity`:
- `POST /register` - Benutzerregistrierung
- `POST /login` - Benutzeranmeldung
- `GET /me` - Aktueller Benutzer (mit Token)

## Entwicklung

```bash
# Dependencies installieren
pnpm install

# Entwicklungsserver starten
pnpm dev

# Build für Module Federation
pnpm build

# Watch-Modus für Module Federation
pnpm dev:watch

# Preview-Server (für Module Federation)
pnpm preview
```

## Module Federation

Die App wird als `remote-app2` exponiert und kann in anderen Apps wie folgt verwendet werden:

```typescript
const App2 = defineAsyncComponent(() => import("remote-app2/App2"));
```

## Routen

- `/` - Home-Seite mit Auth-Status
- `/login` - Login-Formular
- `/register` - Registrierungsformular

## Abhängigkeiten

- Vue 3
- Vue Router
- Pinia
- PrimeVue
- Axios
- Tailwind CSS

