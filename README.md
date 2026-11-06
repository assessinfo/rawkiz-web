# Rawkiz Careers

Single-page careers site for **Rawkiz** — a Singapore-based company hiring internationally.
One page, seven numbered sections, a live roles list read from a Google Sheet, an
application form that saves to that same sheet, and an AI careers assistant.

Live at the URL you publish to; the preview runs the current code.

---

## Stack

| | |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) v1 (React 19, Vite 8, SSR) |
| Styling | Tailwind CSS v4 (theme tokens in `src/styles.css`) |
| Components | shadcn/ui + `lucide-react` |
| Data | TanStack Query, Google Sheets over the Lovable connector gateway |
| PDF export | `jspdf` |
| Animation | `motion` (all motion disabled under `prefers-reduced-motion`) |
| Tests | Vitest (`src/test/`) |
| Runtime | Bun (`bun.lock`) |

---

## Getting started

```sh
bun install
bun run dev      # http://localhost:8080
```

| Command | What it does |
| --- | --- |
| `bun run dev` | Dev server with hot reload |
| `bun run build` | Production build (Nitro; Cloudflare target by default) |
| `npm run build:node` | Production build for a plain Node.js server (cPanel) |
| `bun run preview` | Serve the production build locally |
| `bun run test` | Run the test suite |
| `bun run lint` / `bun run format` | ESLint / Prettier |

---

## Page layout

Everything visitors see lives in one route, `src/routes/index.tsx`, split into numbered sections:

| # | Section | Anchor |
| --- | --- | --- |
| 01 | Why Rawkiz | `#why` |
| 02 | Based in Singapore, working worldwide | `#global` |
| 03 | Career areas (open to expressions of interest) | `#areas` |
| 04 | Open roles — from the Google Sheet | `#roles` |
| 05 | Application form | `#apply` |
| 06 | Interview guidance | `#interview` |
| 07 | FAQ | `#faq` |

`/chat` is a separate route holding the careers assistant.

---

## Where to edit content

**Almost every word on the page comes from `src/data/content.ts`.** Company name,
values, career areas, interview steps, prep tips, FAQ and footer socials are all
there — change the data, no component edits needed.

```
src/data/content.ts   # all careers copy, career areas, FAQ, socials
src/routes/index.tsx  # page structure and the application form
src/styles.css        # colours, fonts, animations
```

### Footer social links

LinkedIn / Instagram / X are configurable in `socials`. A link only appears when
its `url` holds a real `https://…` (or `mailto:`) destination — an empty string or
a `[PLACEHOLDER]` keeps it hidden, so no dead links ever reach the page.

### Placeholders still to confirm

Text in `[SQUARE BRACKETS]` is unconfirmed and must be replaced before launch:

- `[WHAT RAWKIZ DOES — one-line company description]`
- `[CONFIRM LEARNING BUDGET / PROGRAMS]`
- `[CONFIRM VISA & WORK-PASS POLICY]`
- `[CONFIRM INTERNATIONAL HIRING POLICY]`
- `[CONFIRM REMOTE POLICY]`
- `[CONFIRM INTERNSHIP POLICY]`
- `[ADD TYPICAL TIMELINE]`
- `[ADD HR CONTACT EMAIL WHEN AVAILABLE]`

---

## Google Sheet connection

Spreadsheet **Rawkiz Careers** —
`1x6Yok1TWkhbzGmNCEYso7iXs15V7Fl8KsLAcUEBF6Ks`

| Tab | Columns | Used for |
| --- | --- | --- |
| `Roles` | Title, Team, Location, Type, Description, Open | Section 04. Rows with `Open` = `yes` are shown. |
| `Applications` | Submitted at, Name, Email, Phone, Location, Time zone, Career area, Experience, Work pass, Links, Availability, Skills, Motivation, Source | Every submitted application appends one row. |

Code: `src/lib/sheets.functions.ts` (`getRoles`, `submitApplication`).
Values are appended with `valueInputOption=RAW` so phone numbers such as
`+65 1234 5678` are stored as text, not parsed as a formula.

Environment variables the server needs: `LOVABLE_API_KEY`, `GOOGLE_SHEETS_API_KEY`.

---

## Careers assistant

`/chat` embeds the team's **Landbot** agent in an iframe; the URL sits in
`LANDBOT_URL` at the top of `src/routes/chat.tsx`. Reach it from the
"Ask the AI assistant →" link in the page header.

`src/routes/api/chat.ts` (the earlier Lovable AI endpoint, with its system prompt in
`src/lib/chat.server.ts`) is no longer used by the UI — kept for reference, safe to delete.

---

## Design rules

- Dark near-black base, **electric lime** as the single accent, **cyan** used sparingly.
- Space Grotesk for display headings, Inter for body, JetBrains Mono for labels/tags.
- Large section numbers, asymmetric grid, subtle grid-line background, scroll-reveal fades.
- WCAG AA contrast, keyboard navigable, visible focus states, every form field labelled.
- `prefers-reduced-motion` turns all animation off.

---

## Deployment

**Lovable:** Publish → Publish changes. Database/secrets apply immediately; app code
on publish.

**cPanel:** two routes.

*Prebuilt package* — upload `rawkiz-cpanel.zip`, unzip it, and in Application
Manager create a Node.js app with startup file `.output/server/index.mjs`, add
`LOVABLE_API_KEY` and `GOOGLE_SHEETS_API_KEY`, then Start. No install or build
step on the server.

*Git Version Control* — `.cpanel.yml` in this repo drives the deploy. Before the
first deploy, edit `USERNAME`, `APPNAME` and `DEPLOYPATH` inside it. The deploy
runs `npm run build:node` (Nitro `node-server` preset), which writes
`.output/server/index.mjs` and `.output/public/`, then copies the public files
into `DEPLOYPATH`. Point the Node app at `.output/server/index.mjs`, set both
environment variables, and **map the domain to the app** (Application URL /
domain field): the built `public/` folder holds assets only, no `index.html`, so
the pages come from the server and an unmapped domain shows an empty folder.
`npm run build` stays on the Cloudflare target for Lovable publish.

---

## Conventions

- Server functions live in `src/lib/` (`*.functions.ts`, `*.server.ts`) — the build
  rejects a `src/server/` folder.
- `src/routeTree.gen.ts` is generated; never edit it by hand.
- No specific vacancies are hard-coded — career areas are "open to expressions of
  interest", and open roles come only from the `Roles` tab.
