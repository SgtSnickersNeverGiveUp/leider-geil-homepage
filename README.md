# Leider Geil — Clan Homepage

Moderne, responsive Web-Präsenz für den PC-Gaming-Clan **Leider Geil** (PUBG, ARC Raiders & weitere
Multiplayer-Titel). Gebaut mit TanStack Start (React 19) und für Deployment auf Netlify
(statisches Hosting + Netlify Forms + Functions) vorbereitet.

## Features

- **Startseite** mit Banner, News-Ticker, Welcome-Block, CTAs zu Discord / Twitch / Bewerbung,
  Teaser-Karten für Roster, Events und Videos.
- **Roster** als Grid mit Member-Karten inkl. Modal-Detailansicht.
- **Events & Meilensteine** — Event-Karten mit Anmelde-Button + 6er-Timeline.
- **Video-Galerie** mit YouTube-Embed im Modal.
- **Bewerbungsformular** und **Event-Anmeldung** über Netlify Forms.
- **Kontakt-/Discord-Sektion** mit pulsierender „Online"-Lampe (`<OnlineLamp />`).
- **Admin-Dashboard** unter `/admin` (nur per Direktlink) mit Tabs für Bewerbungen, Roster,
  Events, Videos, Banner & News-Ticker und Event-Anmeldungen — UI-vollständig, Persistenz
  über kommentierte Hooks für Netlify Functions vorbereitet.

## Tech Stack

| Layer       | Technologie                            |
|-------------|----------------------------------------|
| Framework   | TanStack Start (file-based routing)    |
| UI          | React 19                               |
| Styling     | Globale CSS-Variablen + Utility-Klassen (in `src/styles.css`), Tailwind 4 verfügbar |
| Build       | Vite 7                                 |
| Sprache     | TypeScript 5.7 (strict)                |
| Forms       | Netlify Forms (statische Form-Skeletons in `public/__forms.html`) |
| Deployment  | Netlify (`@netlify/vite-plugin-tanstack-start`) |
| Fonts       | Rajdhani (Headlines), Inter (Body), Fira Code (Mono) — über Google Fonts geladen |

## Lokale Entwicklung

```bash
npm install
npm run dev          # Vite dev server auf http://localhost:3000
```

Optional über die Netlify CLI (lokal Forms-Endpoints, Functions, etc. emulieren):

```bash
netlify dev          # http://localhost:8888 (proxy auf Vite)
```

## Deployment auf Netlify

1. Repository nach GitHub/GitLab/Bitbucket pushen.
2. In Netlify ein **„Add new site → Import an existing project"** anlegen.
3. Build-Command und Publish-Verzeichnis stehen bereits in `netlify.toml`:
   - Build Command: `vite build`
   - Publish Directory: `dist/client`
4. Deployen — Netlify erkennt automatisch die Forms aus `public/__forms.html` und das
   TanStack-Start-SSR-Setup aus dem Vite-Plugin.

> **Hinweis Netlify Forms:** Das tatsächliche Formular-Targeting passiert über die
> statische Datei `public/__forms.html`. Diese Datei darf nicht gelöscht werden, sonst
> registriert Netlify die Formulare nicht.

## Datenmodell

Sämtliche Inhalte liegen in JSON-Dateien unter `src/data/`. Diese Dateien sind die
„Single Source of Truth" der Demo-Inhalte und können in einem späteren Schritt durch
Netlify Functions + DB ersetzt werden, ohne dass das UI angepasst werden muss
(Typen kommen aus `src/lib/types.ts`).

| Datei                     | Inhalt                                      |
|--------------------------|---------------------------------------------|
| `members.json`            | Roster-Mitglieder                           |
| `events.json`             | Geplante Events                             |
| `news.json`               | News-Ticker-Items                           |
| `videos.json`             | Video-Galerie                               |
| `milestones.json`         | Meilensteine (Timeline – genau 6 Einträge) |
| `settings.json`           | Banner-URL, Discord-/Twitch-/YouTube-Links, Ticker-Speed |

## Erweiterung

- **Echter Login (Admin):** TanStack-Start `beforeLoad` an `/admin` hängen, das
  Netlify Identity / Auth0 / Clerk auf Auth-Cookies prüft.
- **Persistente Speicherung:** Netlify Functions (`netlify/functions/admin-*.ts`) +
  Netlify Database (Postgres) oder Netlify Blobs für Settings/Roster/Events.
- **Bild-Uploads:** UI-Stubs vorhanden in `/admin` — anbinden an Netlify Blobs oder
  externes Storage (Cloudinary, S3).
- **Form-Submissions im Admin:** statt Dummy-Daten die Netlify-Forms-API anbinden.

Suchbegriffe in der Codebase für die nächsten Schritte:

```bash
grep -R "TODO (later)" src
```
