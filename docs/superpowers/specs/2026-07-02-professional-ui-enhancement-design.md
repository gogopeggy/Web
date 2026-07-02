# Professional UI Enhancement — Design

**Date:** 2026-07-02
**Goal:** Elevate the visual design of the Peggyideas React app to a formal, professional, resume-quality standard — without changing any functionality or backend behavior.

## Context

Single-page React 18 + MUI v5 app (`react-scripts` 5) with routes: Home, Recipe, Expense (+ details), Camping, Booking (+ manage), Profile. Current styling is ad-hoc:

- `src/index.css` sets `font-family: 'initial'` globally (a broken value) and `'emoji'` on nav links; the imported Quicksand font is never actually applied.
- Navbar uses a bright cyan accent (`#4cdce9`) and a playful brain logo.
- Each page hardcodes its own colors via `sx` (e.g. Recipe `#a94848`/`#40a0c2`, Expense's 9 neon category colors), with no central theme.
- The Booking feature is the exception: it is a deliberately branded seafood-restaurant reservation product ("漁家莊") using a warm brown/gold palette (`#1f1b16`, `#d4a857`, cream `#fffdf8`) and is already the most polished area.

## Decisions

- **Visual direction:** Corporate navy & slate (professional, trustworthy).
- **Scope:** Full — central theme + polish on every page.
- **Booking branding:** Keep booking's warm restaurant identity (demonstrates design range); raise its polish/consistency to the new bar. Navy theme applies to all *other* pages.
- **No functional changes:** routing, data flow, worker calls, localStorage, LIFF, and validation logic are untouched. This is a pure presentation pass.

## Architecture

### 1. Central theme — `src/theme.js` (new)

A single `createTheme(...)` export defining the design system so every page levels up by inheritance.

- **Palette:**
  - `primary.main` `#1e293b` (navy/slate-800), `primary.light`/`dark` derived.
  - `secondary`/accent `#2563eb` (blue-600).
  - `background.default` `#f8fafc`, `background.paper` `#ffffff`.
  - `text.primary` `#1e293b`, `text.secondary` `#64748b` (slate-500).
  - Standard `success`/`error`/`warning`/`info` tuned to slate-compatible tones.
- **Typography:** `Inter` (with system-ui fallback), loaded via Google Fonts `@import` in `index.css`. Defined heading scale (h1–h6), `button` with `textTransform: none`, readable body sizes/line-heights.
- **Shape:** `borderRadius: 10`.
- **Component defaults (`components` overrides):**
  - `MuiButton`: `disableElevation`, medium weight, comfortable padding.
  - `MuiPaper`/`MuiCard`: subtle border (`1px solid` slate-200) + soft shadow instead of heavy MUI elevation.
  - `MuiTextField`/`MuiSelect`: consistent `small`/`medium` sizing, refined focus color.
  - `MuiAppBar`/nav surfaces where applicable.

Wired in `src/App.js`: wrap the app in `<ThemeProvider theme={theme}>` + `<CssBaseline />` (inside the existing `LocalizationProvider`). No logic changes to `App.js` beyond adding the providers.

### 2. Global CSS — `src/index.css` (rewrite)

- Replace `font-family: 'initial'`/`'emoji'` with the Inter stack; drop the unused Quicksand import (or swap it for Inter).
- Rebuild `.navbar` as a clean, professional top bar: proper spacing, subtle bottom border, brand lockup on the left, links on the right with an underline/weight active state (replace cyan `#4cdce9` with the theme accent). Keep the existing responsive breakpoint behavior.
- Keep `.content` max-width container; refine spacing.
- Keep `.circular-text` rules (used elsewhere) unless confirmed dead.

### 3. Per-page polish

Each page keeps its component structure and all handlers; only presentation (`sx`, wrappers, color props, minor markup for layout) changes.

- **Navbar (`src/pages/home/Navbar.js`):** professional brand lockup; consistent link styling driven by CSS/theme; dropdown menu inherits theme. Consider a more neutral logo treatment (keep existing asset).
- **Home (`src/pages/home/Home.js`):** convert the flat gray card into a dashboard: a heading/greeting, a date+clock card, and weather rendered as four stat tiles (icon + label + value) instead of plain label/value rows. Remove hardcoded `#f3f3f3`.
- **Recipe (`src/pages/recipe/recipeList.js`):** themed heading (drop `#a94848`/`#40a0c2`/`Segoe UI`), consistent search controls, and uniform recipe result cards (image + caption in a `Card` with hover elevation) replacing raw clickable `<img>` + text button. Fix "ingridient" placeholder typo.
- **Expense (`src/pages/expense/expense.js`):** replace the 9 saturated neon category colors with a tasteful, tonal category palette (still visually distinct, but muted/professional); refine the summary tiles (readable contrast, consistent radius) and the date/Add/total header row.
- **Expense details (`src/pages/expense/details.js`):** style the DataGrid (header background, row hover, borders) to match the theme; clearer Back and row-action affordances.
- **Camping (`src/pages/camping/camping.js`):** cleaner filter/summary bar; restyle the absolutely-positioned map info window as a proper themed card (replace inline white box with theme shadow/radius/typography).
- **Profile (`src/pages/profile/profile.js`):** keep the LINE-embedded, Navbar-less layout; give the welcome/loading screen clean typography and spacing. Fix the missing React `key` on the mapped profile images while here (low-risk correctness).
- **NotFound (`src/pages/notFound/NotFound.js`):** centered, on-brand 404 with a themed "back home" action.
- **Shared dialogs (`src/components/expense/dialog.js`, `dialogContent.js`, `generalDialog.js`):** inherit theme; light spacing/typography touch-ups only if needed for consistency.

### 4. Booking (keep brand, raise polish)

`booking.js`, `manage.js`, `BookingForm.js` retain the brown/gold restaurant identity. Changes limited to consistency polish: align spacing scale, ensure the hardcoded palette is applied consistently, and verify it still reads well against the new global font/CSS reset. No re-skin to navy. Optionally extract the repeated brown/gold hex values into small local constants for consistency (no behavior change).

## Non-Goals (YAGNI)

- No dark mode.
- No new dependencies beyond a web font (loaded via CSS `@import`, no npm package).
- No component-library swap; stay on MUI v5.
- No routing/data/state/logic changes.
- No re-skin of the booking feature to navy.

## Testing / Verification

- `npm run build` must succeed with no new ESLint errors (CRA treats CI lint errors as build failures).
- Manual visual pass on each route (`/`, `/recipe`, `/expense`, `/expense/details`, `/camping`, `/booking`, `/booking/manage`, `/profile`, and a 404) at desktop and mobile widths.
- Confirm no functional regressions: weather loads on Home, recipe search works, expense CRUD + navigation, camping map + distance, booking reserve flow + manage, LIFF profile path unaffected.

## Follow-up

- Per the repo convention, update `CLAUDE.md` if the theme introduces a new source of truth for styling (e.g. document `src/theme.js` as the design system entry point).
