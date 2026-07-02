# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a Create React App project (`react-scripts` 5).

- `npm install` — install dependencies
- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — run Jest in watch mode
  - Single file: `npm test -- src/path/to/file.test.js`
  - Filter by name: `npm test -- -t "partial test name"`
  - Single run (CI mode): `set CI=true&& npm test` (Windows) or `CI=true npm test`
- `serve -s build` — serve the production build locally (requires `npm i -g serve`)

There is no separate lint script; ESLint runs through `react-scripts` via the `react-app` / `react-app/jest` configs in `package.json`.

### Worker (`d1-tutorial/`)

The Cloudflare Worker source lives in this repo under [d1-tutorial/](d1-tutorial/). The root `.gitignore` still lists `/d1-tutorial`, so worker files were force-added — when adding new ones, use `git add -f d1-tutorial/<path>`.

- `cd d1-tutorial && npm install` — install worker deps
- `npx wrangler dev` — run the worker locally
- `npx wrangler deploy` — deploy to `https://d1-tutorial.a29098477.workers.dev`
- `npx wrangler secret put RESEND_API_KEY` — Resend API key (used by `/api/send-booking-email`)
- `npx wrangler secret put GOOGLE_MAPS_API_KEY` — Distance Matrix key (used by `/api/distance`)
- `npx wrangler secret put OPENWEATHER_API_KEY` — OpenWeatherMap key (used by `/api/weather`)
- `npx wrangler secret put EDAMAM_APP_ID` / `EDAMAM_APP_KEY` — Edamam keys (used by `/api/recipe`)

## Architecture

Single-page React 18 app with these moving parts:

**Routing ([src/App.js](src/App.js))** — `BrowserRouter` mounts these routes plus a 404: `/` (Home), `/recipe`, `/expense` (+ `/expense/details`), `/camping`, `/booking` (+ `/booking/manage`), `/profile`. Each path maps to a folder under [src/pages/](src/pages/)`<feature>/`. `Navbar` is rendered on every route **except** `/profile`.

**Backend split — D1 worker vs. localStorage.** Expense and Camping CRUD goes through [src/utility.js](src/utility.js), which targets a Cloudflare Workers + D1 service at `https://d1-tutorial.a29098477.workers.dev/api`. **Booking does NOT use D1** — it persists to `localStorage` via [src/pages/booking/storage.js](src/pages/booking/storage.js) (keys: `bookings`, `blockedDates`, `bookingCapacity`). The only worker call from the booking flow is the email-confirmation POST to `/api/send-booking-email` from [src/pages/booking/email.js](src/pages/booking/email.js). When changing the API shape of expense/camping/email endpoints, the React side and [d1-tutorial/src/index.ts](d1-tutorial/src/index.ts) must move together.

Worker endpoints currently implemented in [d1-tutorial/src/index.ts](d1-tutorial/src/index.ts):
- `GET  /api/expense`, `POST /api/expense/create`, `POST /api/expense/update`, `DELETE /api/expense/delete`
- `GET  /api/camping`
- `GET  /api/recipe` — Edamam recipe-search proxy (used by the Recipe page to dodge browser CORS; app_id/app_key read from `EDAMAM_APP_ID`/`EDAMAM_APP_KEY` secrets)
- `GET  /api/distance` — Google Maps Distance Matrix proxy (used by the Camping page; key from `GOOGLE_MAPS_API_KEY` secret)
- `GET  /api/weather` — OpenWeatherMap proxy (used by `App.js` on mount so the OWM key stays server-side; key from `OPENWEATHER_API_KEY` secret)
- `POST /api/send-booking-email` — Resend-backed booking confirmation email

**Booking feature ([src/pages/booking/](src/pages/booking/))** — Two routes share one form component:
- `/booking` ([booking.js](src/pages/booking/booking.js)) is the customer-facing single-booking flow.
- `/booking/manage` ([manage.js](src/pages/booking/manage.js)) is the admin view: list/edit/delete bookings, block dates, set per-service capacity, seed dummy data.
- [BookingForm.js](src/pages/booking/BookingForm.js) is the shared form, [storage.js](src/pages/booking/storage.js) is the localStorage layer + validation + capacity math, [email.js](src/pages/booking/email.js) POSTs the confirmation request to the worker.

Capacity model: each date has a lunch (slots before 16:00) and dinner (slots ≥ 16:00) head-count cap (defaults 10/10). A date is "full" only when **both** services hit capacity. Bookings are identified by a locally-minted `${Date.now()}-${random}` id — no server collision check.

**State ([src/Redux/](src/Redux/))** — Redux Toolkit store has a single slice. Note the mismatch: the slice is named `weatherSlice` and exports a `getWeather` action, but it is mounted under the `user` reducer key in `store.js`. Components reading weather must select from `state.user`. On app mount, `App.js` fetches OpenWeatherMap for hardcoded Taipei coordinates and dispatches it into this slice. Booking state is **not** in Redux — it reads/writes localStorage directly.

**LINE LIFF integration** — `@line/liff` is initialized *only* when `window.location.pathname === '/profile'` (LIFF ID hardcoded in `App.js`). The profile name flows down as a prop, not through Redux. This conditional init is why `Navbar` is also suppressed on `/profile` — that route is meant to be embedded inside the LINE app.

**UI library** — MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers` with the Moment adapter wired at the App root). The Camping page uses `@vis.gl/react-google-maps`. Date handling uses `moment` (with `moment/locale/zh-tw` loaded by the booking pages). `animejs` is installed but check before assuming any given page uses it.

**Design system** — Global styling flows from a single MUI theme in [src/theme.js](src/theme.js), applied via `ThemeProvider` + `CssBaseline` at the App root ([src/App.js](src/App.js)). The dashboard pages (Home, Recipe, Expense, Camping, Profile, 404) use a navy/slate palette with the Inter font (loaded via `@import` in [src/index.css](src/index.css)). The **Booking** feature intentionally keeps a separate warm brown/gold restaurant brand (`#1f1b16`/`#d4a857`/`#fffdf8`) and is NOT themed by `src/theme.js` — treat it as a distinct visual identity when editing.

**Components vs. pages** — [src/pages/](src/pages/)`<feature>/` holds route-level screens; [src/components/](src/components/) holds shared/reused pieces (currently `expense/` dialogs and a `generalDialog.js`). Booking-only sub-components live inside [src/pages/booking/](src/pages/booking/) rather than `src/components/`.

**Code style** — The booking feature and recent edits to existing pages use tabs and single quotes; older untouched code uses 2-space indent and double quotes. There is no project-wide Prettier config at the repo root — only [d1-tutorial/.prettierrc](d1-tutorial/.prettierrc) (tabs + single quotes), which de facto reflects the newer style. Match the surrounding file when editing.

## Secrets to be aware of

- **Server-side secrets (Wrangler secrets, not in source):** `RESEND_API_KEY`, `GOOGLE_MAPS_API_KEY` (Distance Matrix), `OPENWEATHER_API_KEY`, `EDAMAM_APP_ID`/`EDAMAM_APP_KEY`. All previously-committed values were exposed in this public repo's history and must be treated as compromised — rotate them, then `wrangler secret put` the new values. The OpenWeatherMap call was moved off the client onto the `/api/weather` proxy for this reason.
- **Necessarily-public client keys:** the Google Maps **JavaScript** key ([camping.js](src/pages/camping/camping.js), via `REACT_APP_API_MAPS`) and the LIFF ID ([App.js](src/App.js)) ship in the browser bundle and cannot be hidden. The env var only keeps the Maps key out of source — protect the key itself with HTTP-referrer + API restrictions in Google Cloud Console, and rotate the old hardcoded one.
- Client env vars: `REACT_APP_*` are baked into the bundle (NOT secret). The Maps key lives in `.env` (gitignored) as `REACT_APP_API_MAPS`.
- Do not introduce additional secrets in client code — anything sensitive belongs in the Workers backend as a secret binding, not a literal.
