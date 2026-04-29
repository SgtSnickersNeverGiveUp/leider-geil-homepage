# AGENTS.md

Guide for AI agents and humans working on this codebase.

## Project

Clan-Homepage **Leider Geil** — a marketing/community site for a PC gaming clan
(PUBG, ARC Raiders, …). Built with TanStack Start, deployed to Netlify.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| UI | React 19 |
| Build | Vite 7 |
| Language | TypeScript 5.7 (strict) |
| Styling | Custom CSS in `src/styles.css` with CSS variables + utility classes; Tailwind 4 plugin available but not used by default |
| Forms | Netlify Forms (skeleton in `public/__forms.html`) |
| Deployment | Netlify (`@netlify/vite-plugin-tanstack-start`) |
| Fonts | Rajdhani (headlines), Inter (body), Fira Code (mono) – Google Fonts |

## Directory Structure

```
public/
  __forms.html                # Static skeleton — Netlify scans this at build to register forms
  placeholder.png
  favicon.ico
src/
  components/
    Header.tsx                # Sticky header + mobile nav + Discord/Twitch buttons with OnlineLamp
    Footer.tsx                # Footer with quick links, includes link to /admin
    NewsTicker.tsx            # Marquee-style ticker driven by data/news.json
    OnlineLamp.tsx            # Pulsing green status indicator
    MemberCard.tsx            # Roster card (avatar, role, games, fun-tags, optional buttons)
    EventCard.tsx             # Event card with optional signup CTA
    VideoCard.tsx             # Video tile with platform tag and play handler
    Timeline.tsx              # Vertical milestone timeline
    Modal.tsx                 # Generic modal dialog
  data/
    settings.json             # Clan settings (banner URL, social URLs, ticker text/speed)
    members.json              # Roster
    events.json               # Events list
    news.json                 # News ticker items
    videos.json               # Video gallery
    milestones.json           # Exactly 6 milestones for the timeline
  lib/
    types.ts                  # TS types for all data files + gameTagClass() helper
  routes/
    __root.tsx                # Document shell + Header + NewsTicker + Footer
    index.tsx                 # Home page (banner, welcome, teasers, full feature blocks)
    roster.tsx                # /roster
    events.tsx                # /events (events + milestones timeline)
    videos.tsx                # /videos with embedded player modal
    bewerbung.tsx             # /bewerbung – Netlify form "bewerbung"
    event-anmeldung.tsx       # /event-anmeldung – Netlify form "event-anmeldung"
    kontakt.tsx               # /kontakt – Discord/Twitch/Email
    admin.tsx                 # /admin – internal dashboard (no auth yet)
  router.tsx                  # createRouter from routeTree.gen
  styles.css                  # Theme tokens + utility classes (.lg-panel, .lg-btn, etc.)
netlify.toml                  # Build = vite build, publish = dist/client
vite.config.ts                # TanStack Start, React, Tailwind, Netlify plugin
tsconfig.json                 # Strict + @/* alias + resolveJsonModule
```

## Theme Tokens

All colours, fonts and reusable UI shapes come from `src/styles.css`. Use these
**variables and utility classes** rather than hardcoding hex values:

```css
--clr-bg / --clr-surface / --clr-surface-alt / --clr-border
--clr-text / --clr-text-muted
--clr-accent-arc   /* #0FF2A9 — primary accent + ARC Raiders */
--clr-accent-pubg  /* #FF9C43 — PUBG accent */
--clr-danger       /* #ff3b5c */
--font-headline / --font-body / --font-mono
```

Reusable classes: `.lg-panel`, `.lg-panel-alt`, `.lg-btn`, `.lg-btn-primary`,
`.lg-btn-pubg`, `.lg-btn-danger`, `.lg-tag` (+ `-pubg`, `-arc`), `.lg-input`,
`.lg-textarea`, `.lg-select`, `.lg-label`, `.lg-table`, `.lg-modal`, `.lg-lamp`,
`.lg-ticker`, `.lg-banner`, `.lg-timeline`, `.lg-avatar`, `.lg-headline`,
`.lg-glow-arc`.

Use `gameTagClass(game)` from `@/lib/types` to colour PUBG / ARC Raiders tags
consistently.

## Routing

File-based via TanStack Router. Each new page is a file in `src/routes/`. The
generated `routeTree.gen.ts` is rebuilt by the Vite plugin on dev/build — do not
edit it. To add a page, drop `src/routes/<name>.tsx` exporting `Route =
createFileRoute('/<name>')(...)` and link to it via `<Link to="/<name>" />`.

## Forms (Netlify)

`public/__forms.html` contains the static skeleton forms (`bewerbung`,
`event-anmeldung`). The React forms post via `fetch('/__forms.html')` with
`application/x-www-form-urlencoded` (see `bewerbung.tsx` / `event-anmeldung.tsx`).
**Both files must stay in sync field-for-field** — Netlify rejects unknown fields.

If you add or rename a form field in either route, mirror the change in
`public/__forms.html`.

## Admin Area

`/admin` is intentionally **not linked from the main nav** (only from the footer).
There is no auth yet — every save/delete only mutates local React state. All
mutation handlers carry a `// TODO (later)` comment marking where to wire up
Netlify Functions. Search the repo for `TODO (later)` for an audit of all such
extension points.

## Conventions

- Components: PascalCase in `src/components/`. Prefer the existing card/lamp/modal
  primitives instead of building one-offs.
- Imports: `@/` resolves to `src/` (see `tsconfig.json` paths).
- Strings: User-facing copy is **German**. Code/comments may stay in English or
  German — match the file you're editing.
- Data: read-only JSON in `src/data/`. Don't add runtime mutations there;
  long-term those become Netlify Function calls.
- Styles: prefer the tokens / utility classes; inline `style={}` is fine for
  one-off layout, but colours and fonts must come from CSS variables.

## Common Commands

```bash
npm run dev      # Vite dev server (port 3000)
npm run build    # Production build (do not run in agent runs — handled by CI)
netlify dev      # Full Netlify emulator on port 8888
```

## Future-Work Hooks (search markers)

- `TODO (later)` — every place where persistence / auth / uploads need wiring.
- `dummy*` exports in `admin.tsx` — replace with Netlify Forms API + DB calls.
