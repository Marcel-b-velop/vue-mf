# Vue Module Federation

## Ziel

Eine Anwendung mit mehreren Seiten, einem Header, Footer und einer Navigationsleiste. Die einzelnen Seiten sollen als Remote Module geladen werden. Der Host hält die Navigationsleiste, Header und den Footer.

Mehrfach genutzte Steuerelemente sollen durch eine Library bereitgestellt werden, auch Funktionslogik soll geteilt werden, ob durch NPM oder auch über die Library (Typisierung könnte dann vielleicht in Problem sein) muss noch erarbeitet werden.

Das Styling soll auch mehrfach genutzt werden, auch hier ist noch zu erarbeiten, welches die beste Strategie ist.

Ein Steuerelement soll ein Auswahldialog sein. Man soll den Dialog mit Selektionen initialisieren können. Der Dialog weiß, wo er seine Daten laden kann. Werden Daten im Dialog selektiert, landen diese nach Speicherung wieder beim Aufrufer.

## Testaufbau

- Host: Host der/für Anwendung/en
- App1:
  Eine Anwendung, welche zu Testzwecken eine Library mit einem Dialog nuten soll
- Lib: Stellt einen Dialog bereit, der von mehreren Anwendungen benutzt werden kann

## Gelöste Probleme:

- Primevue, Pinia, Vue sollten von allen Anwendungen geteilt werden. In der vite.config.ts wird das konfiguriert, Primivue hat dort Probleme gemacht. Für Primevue musste nur in der Host Anwendung die vite.confit.ts erweitert werden: `primevue: { requiredVersion: "^4.1.1", version: "^4.1.1", singleton: true }` . Die Lösung war version und requiredVersion.

- Tailwind Klassen der Lib und App1 wurden in der Hostanwendung nicht aufgelöst. Folgender Code hat in der vite.config.ts der Lib und App1 zur Lösung geführt (in der Host Anwendung gab es die Anpassung nicht):

```typescript
build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
```
