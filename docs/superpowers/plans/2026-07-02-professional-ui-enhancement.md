# Professional UI Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the Peggyideas React app to a formal, professional, resume-quality look via a central MUI theme and per-page polish, with zero functional changes.

**Architecture:** Introduce a single source-of-truth MUI theme (`src/theme.js`) wired through `ThemeProvider` + `CssBaseline` in `App.js`, rewrite global CSS and the navbar, then apply presentation-only polish to each page. The Booking feature keeps its warm brown/gold restaurant brand (polish only); all other pages adopt the navy/slate system.

**Tech Stack:** React 18, `react-scripts` 5, MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers`), `moment`, `@vis.gl/react-google-maps`. Inter font loaded via CSS `@import` (no new npm dependency).

## Global Constraints

- **No functional changes:** routing, data flow, worker API calls, localStorage, LIFF init, and validation logic must remain byte-for-byte behaviorally identical. Presentation only (`sx`, `style`, color props, className, theme, minor layout markup).
- **No new npm dependencies.** Web font is loaded via CSS `@import` only.
- **Build must stay green:** `npm run build` must succeed with no new ESLint errors. CRA (`react-scripts`) treats lint errors as build failures in CI mode.
- **Stay on MUI v5.** No component-library swap, no dark mode.
- **Booking stays brown/gold** (`#1f1b16` brown, `#d4a857` gold, `#fffdf8` cream). Do NOT re-skin booking to navy.
- **Dashboard palette (verbatim):** primary navy `#1e293b`, accent blue `#2563eb`, slate text-secondary `#64748b`, borders slate-200 `#e2e8f0`, background `#f8fafc`, paper `#ffffff`, success `#16a34a`, error `#dc2626`, warning `#d97706`.
- **Code style:** match the surrounding file. Booking + Home + Navbar use tabs & single quotes; Recipe/Expense/Camping/Profile use 2-space indent & double quotes.
- **Verification per task:** run `npm run build` (expect `Compiled successfully` / no errors) and visually check the affected route via `npm start`.

---

### Task 1: Theme foundation + provider wiring

Create the central theme, load the font, and wrap the app. After this task every page already looks different (fonts, colors, button/paper defaults) with no per-page edits yet.

**Files:**
- Create: `src/theme.js`
- Modify: `src/App.js` (add providers around existing tree)
- Modify: `src/index.css:1` (swap font import)

**Interfaces:**
- Produces: `src/theme.js` default export `theme` (a MUI theme object). Consumed by `App.js` and available for any page that needs `useTheme()`.

- [ ] **Step 1: Create `src/theme.js`**

```js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#1e293b', light: '#334155', dark: '#0f172a', contrastText: '#ffffff' },
		secondary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8', contrastText: '#ffffff' },
		success: { main: '#16a34a' },
		error: { main: '#dc2626' },
		warning: { main: '#d97706' },
		info: { main: '#2563eb' },
		background: { default: '#f8fafc', paper: '#ffffff' },
		text: { primary: '#1e293b', secondary: '#64748b' },
		divider: '#e2e8f0',
	},
	shape: { borderRadius: 10 },
	typography: {
		fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
		h1: { fontWeight: 800, letterSpacing: '-0.02em' },
		h2: { fontWeight: 700, letterSpacing: '-0.02em' },
		h3: { fontWeight: 700 },
		h4: { fontWeight: 700 },
		h5: { fontWeight: 700 },
		h6: { fontWeight: 600 },
		subtitle1: { fontWeight: 600 },
		subtitle2: { fontWeight: 600 },
		button: { textTransform: 'none', fontWeight: 600 },
	},
	components: {
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: { root: { borderRadius: 8 } },
		},
		MuiPaper: {
			styleOverrides: {
				root: { backgroundImage: 'none' },
				outlined: { borderColor: '#e2e8f0' },
			},
		},
		MuiCard: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: {
					border: '1px solid #e2e8f0',
					borderRadius: 12,
					boxShadow: '0 1px 3px rgba(15,23,42,.08), 0 1px 2px rgba(15,23,42,.04)',
				},
			},
		},
		MuiAppBar: { defaultProps: { color: 'inherit', elevation: 0 } },
		MuiTextField: { defaultProps: { size: 'small' } },
		MuiOutlinedInput: {
			styleOverrides: { root: { borderRadius: 8 } },
		},
	},
});

export default theme;
```

- [ ] **Step 2: Wire providers in `src/App.js`**

Add these imports after the existing MUI imports (near line 3):

```js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
```

Wrap the existing `LocalizationProvider` return (lines 67-88) so the outermost provider is `ThemeProvider`, with `CssBaseline` directly inside it:

```js
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<BrowserRouter>
					<div className='App'>
						{window.location.pathname === '/profile' ? null : <Navbar />}
						<div className='content'>
							<Routes>
								<Route exact path='/' element={<Home />}></Route>
								<Route path='*' element={<NotFound />}></Route>
								<Route path='/recipe' element={<RecipeList />}></Route>
								<Route path='/expense' element={<Expense />}></Route>
								<Route path='/expense/details' element={<Details />}></Route>
								<Route path='/camping' element={<Camping />}></Route>
								<Route path='/booking' element={<Booking />}></Route>
								<Route path='/booking/manage' element={<ManageBooking />}></Route>
								<Route path='/profile' element={<Profile user={user} />}></Route>
							</Routes>
						</div>
					</div>
				</BrowserRouter>
			</LocalizationProvider>
		</ThemeProvider>
	);
```

- [ ] **Step 3: Swap the font import in `src/index.css`**

Replace line 1 (the Quicksand `@import`) with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

And replace the broken global font rule (lines 3-6):

```css
* {
	box-sizing: border-box;
}

body {
	font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
	-webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.` with no ESLint errors.

- [ ] **Step 5: Visual check**

Run `npm start`, open http://localhost:3000. Expected: Inter font is applied app-wide, background is light slate, buttons are non-uppercase. No layout breakage.

- [ ] **Step 6: Commit**

```bash
git add src/theme.js src/App.js src/index.css
git commit -m "feat(ui): add central MUI theme, Inter font, and provider wiring"
```

---

### Task 2: Global CSS + professional Navbar

Rebuild the navbar as a clean top bar and remove the cyan accent / broken font-families.

**Files:**
- Modify: `src/index.css:8-119` (navbar + responsive rules)
- Modify: `src/pages/home/Navbar.js` (brand lockup + link classes)

**Interfaces:**
- Consumes: theme accent from Task 1 (for hover/active color reference in CSS constants).
- Produces: `.navbar`, `.navbar-inner`, `.brand`, `.nav-links`, `.navactive` CSS contract used by `Navbar.js`.

- [ ] **Step 1: Replace navbar CSS block in `src/index.css`**

Replace the current navbar rules (lines 8-64) with:

```css
.navbar {
	position: sticky;
	top: 0;
	z-index: 1100;
	background: #ffffff;
	border-bottom: 1px solid #e2e8f0;
}

.navbar-inner {
	max-width: 900px;
	margin: 0 auto;
	padding: 14px 20px;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
}

.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	font-weight: 700;
	font-size: 16px;
	color: #1e293b;
}

.navbar .links {
	margin-left: auto;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 4px;
	justify-content: flex-end;
}

.navbar a,
.navbar .nav-dropdown-trigger {
	text-decoration: none;
	color: #64748b;
	font-size: 14px;
	font-weight: 500;
	padding: 8px 12px;
	border-radius: 8px;
	background: none;
	border: none;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	font-family: inherit;
}

.navbar a:hover,
.navbar .nav-dropdown-trigger:hover {
	color: #1e293b;
	background: #f1f5f9;
}

.navactive,
.navbar .nav-dropdown-trigger.navactive {
	color: #1e293b !important;
	font-weight: 600;
	background: #f1f5f9;
}
```

- [ ] **Step 2: Update the responsive block in `src/index.css`**

Replace the `@media (max-width: 600px)` navbar rules (lines 98-114) with:

```css
@media (max-width: 600px) {
	.navbar-inner {
		padding: 10px 12px;
	}
	.navbar .links {
		margin-left: 0;
		margin-top: 6px;
		width: 100%;
		justify-content: center;
	}
	.navbar a,
	.navbar .nav-dropdown-trigger {
		font-size: 13px;
		padding: 6px 8px;
	}
	.content {
		max-width: 100%;
		padding: 0 8px;
	}
}
```

- [ ] **Step 3: Update `src/pages/home/Navbar.js` markup**

Replace the `return (...)` block. Wrap contents in `.navbar-inner`, replace the logo `<img>` + "Ideasss" text with a brand lockup that keeps the existing logo asset:

```jsx
	return (
		<nav className='navbar'>
			<div className='navbar-inner'>
				<div className='brand'>
					<img src={logo} alt='logo' width={30} height={30} />
					<Typography fontSize={16} fontWeight={700} fontFamily={'inherit'}>
						Peggyideas
					</Typography>
				</div>
				<div className='links'>
					{Object.keys(pages).map((p) => (
						<Link
							key={p}
							to={pages[p]}
							className={pathName === pages[p] ? 'navactive' : ''}
						>
							{p}
						</Link>
					))}
					<button
						type='button'
						onClick={openBooking}
						className={`nav-dropdown-trigger ${
							isBookingActive ? 'navactive' : ''
						}`}
						aria-haspopup='menu'
						aria-expanded={Boolean(bookingAnchor)}
					>
						Booking
						<KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.25 }} />
					</button>
					<Menu
						anchorEl={bookingAnchor}
						open={Boolean(bookingAnchor)}
						onClose={closeBooking}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
					>
						{bookingItems.map((item) => (
							<MenuItem
								key={item.path}
								component={Link}
								to={item.path}
								onClick={closeBooking}
								selected={pathName === item.path}
							>
								{item.label}
							</MenuItem>
						))}
					</Menu>
				</div>
			</div>
		</nav>
	);
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.`

- [ ] **Step 5: Visual check**

At http://localhost:3000: navbar is a sticky white bar, "Peggyideas" brand on the left, slate links on the right, active link highlighted (no cyan). Booking dropdown still opens. Check mobile width (<600px) — links wrap centered.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/pages/home/Navbar.js
git commit -m "feat(ui): rebuild navbar as professional sticky top bar"
```

---

### Task 3: Home dashboard

Turn the flat gray card into a dashboard with greeting, date/clock, and weather stat tiles.

**Files:**
- Modify: `src/pages/home/Home.js` (return block + `WeatherInfoGrid` helper)

**Interfaces:**
- Consumes: `weather` from `state.user.weather` (unchanged selector), `today`/`date` locals (unchanged).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Replace the `WeatherInfoGrid` helper with a stat-tile version**

Replace lines 27-36 with:

```jsx
	const WeatherTile = ({ label, value }) => (
		<Grid item md={3} xs={6}>
			<Box
				sx={{
					bgcolor: '#f1f5f9',
					border: '1px solid #e2e8f0',
					borderRadius: 2,
					p: 1.5,
					height: '100%',
				}}
			>
				<Typography variant='caption' color='text.secondary' fontWeight={500}>
					{label}
				</Typography>
				<Typography variant='h6' sx={{ mt: 0.5 }}>
					{value || 'Pending'}
				</Typography>
			</Box>
		</Grid>
	);
```

- [ ] **Step 2: Replace the return block (lines 38-95)**

```jsx
	return (
		<Box>
			<Box sx={{ mb: 2 }}>
				<Typography variant='h5'>Dashboard</Typography>
				<Typography color='text.secondary' variant='body2'>
					Here's your day at a glance.
				</Typography>
			</Box>
			<Card>
				<CardContent>
					<Grid container spacing={2} sx={{ mb: 1 }}>
						<Grid item md={6} xs={6}>
							<Typography variant='caption' color='text.secondary'>
								Date
							</Typography>
							<Typography variant='h6' component='div'>
								<CalendarMonthIcon
									sx={{ verticalAlign: 'sub', pr: 1, color: 'secondary.main' }}
								/>
								{today}
							</Typography>
						</Grid>
						<Grid item md={6} xs={6}>
							<Typography variant='caption' color='text.secondary'>
								Time
							</Typography>
							<Typography variant='h6' component='div'>
								<AccessTimeIcon
									sx={{ verticalAlign: 'sub', pr: 1, color: 'secondary.main' }}
								/>
								{date.toLocaleTimeString()}
							</Typography>
						</Grid>
					</Grid>
					<Typography
						variant='subtitle2'
						color='text.secondary'
						sx={{ mt: 2, mb: 1.5 }}
					>
						Weather
					</Typography>
					<Grid container spacing={1.5}>
						<WeatherTile
							label='Current'
							value={
								weather.main ? `${parseInt(weather.main.temp)}°C` : null
							}
						/>
						<WeatherTile
							label='Description'
							value={weather.des ? `${weather.des[0].description}` : null}
						/>
						<WeatherTile
							label='Feels like'
							value={
								weather.main
									? `${parseInt(weather.main.feels_like)}°C`
									: null
							}
						/>
						<WeatherTile
							label='Temp range'
							value={
								weather.main
									? `${parseInt(weather.main.temp_min)}-${parseInt(
											weather.main.temp_max
									  )}°C`
									: null
							}
						/>
					</Grid>
				</CardContent>
			</Card>
		</Box>
	);
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.` (Note: `Stack` import may now be unused — remove the `import Stack ...` line at line 9 if ESLint flags `no-unused-vars`.)

- [ ] **Step 4: Visual check**

At `/`: "Dashboard" heading, date/clock card, four weather tiles with light slate backgrounds. Clock still ticks; weather values populate.

- [ ] **Step 5: Commit**

```bash
git add src/pages/home/Home.js
git commit -m "feat(ui): redesign Home as dashboard with weather tiles"
```

---

### Task 4: Recipe page

Theme the heading and search controls; render results as uniform cards with hover.

**Files:**
- Modify: `src/pages/recipe/recipeList.js`

**Interfaces:**
- Consumes: `recipes` state, `getRecipes`/`reset`/`onSubmit` handlers (unchanged).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Add Card imports**

After the existing imports (near line 11), add:

```js
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
```

- [ ] **Step 2: Replace the heading (lines 54-64)**

```jsx
      <Typography textAlign={"center"} variant="h5" gutterBottom>
        Let's find your recipes
        <MenuBookIcon
          sx={{ verticalAlign: "middle", pl: 1, color: "secondary.main" }}
        />
      </Typography>
```

- [ ] **Step 3: Fix the placeholder typo (line 80)**

Change `placeholder="Enter ingridient"` to `placeholder="Enter ingredient"`.

- [ ] **Step 4: Replace the results Grid (lines 119-143) with card layout**

```jsx
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {recipes.map((recipe) => {
            const r = recipe["recipe"];
            return (
              <Grid item xs={12} sm={6} md={4} key={r["label"]}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow:
                        "0 10px 25px -5px rgba(15,23,42,.10), 0 8px 10px -6px rgba(15,23,42,.06)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => window.open(r["url"])}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={r["image"]}
                      alt={r["label"]}
                    />
                    <CardContent>
                      <Typography variant="subtitle2">{r["label"]}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.`

- [ ] **Step 6: Visual check**

At `/recipe`: themed heading, aligned search controls, and (after a search) uniform recipe cards that lift on hover and open the recipe URL on click.

- [ ] **Step 7: Commit**

```bash
git add src/pages/recipe/recipeList.js
git commit -m "feat(ui): polish Recipe search and result cards"
```

---

### Task 5: Expense summary + details

Replace neon category colors with a muted tonal palette; refine tiles and DataGrid.

**Files:**
- Modify: `src/pages/expense/expense.js` (color map + tile markup)
- Modify: `src/pages/expense/details.js` (DataGrid styling + Back button)

**Interfaces:**
- Consumes: `overall`, `total`, `color[type]` map (keys unchanged), `getData` handler (unchanged).
- Produces: `color` map keys are unchanged, so `details.js` filtering by `type` is unaffected.

- [ ] **Step 1: Replace the `color` map in `expense.js` (lines 53-63) with muted tones**

Keep the exact same keys (used for filtering); only change hex values:

```js
  const color = {
    Transportation: "#ef8f8f",
    Food: "#e0975f",
    Social: "#d8b24a",
    Shopping: "#8fae5c",
    Others: "#5fae8c",
    Investment: "#4f9d9d",
    Fun: "#5f93c4",
    "Fixed Expense": "#6f7fc4",
    Daily: "#a97fc4",
  };
```

- [ ] **Step 2: Refine the summary tiles in `expense.js` (lines 174-201)**

Replace the tile-rendering Grid with a version that uses a color dot instead of a full neon background:

```jsx
      <Grid container>
        {Object.keys(overall).map((o, index) => (
          <Grid item md={3} xs={6} p={1.5} key={o + index}>
            <Paper
              variant="outlined"
              sx={{ p: 1.5, height: 92, borderRadius: 2 }}
            >
              <Button
                sx={{
                  fontSize: 11,
                  color: "text.secondary",
                  p: 0,
                  minWidth: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
                startIcon={
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: color[o],
                    }}
                  />
                }
                onClick={() => getData(o)}
              >
                {o}
              </Button>
              <Typography fontSize={22} fontWeight={700} textAlign={"center"}>
                {currency(overall[o])}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
```

- [ ] **Step 3: Style the DataGrid and Back button in `details.js` (lines 155-185)**

Replace the outer `return (` opening through the `</Box>` that closes the grid wrapper:

```jsx
  return (
    <Box>
      <Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/expense", { state: { date: curMonth } })}
        >
          Back
        </Button>
      </Box>
      <Box sx={{ height: 380, width: "100%", pt: 1 }}>
        <DataGrid
          rows={rows}
          columnHeaderHeight={45}
          editMode={false}
          rowHeight={45}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          disableColumnResize
          disableColumnMenu
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f1f5f9",
              fontWeight: 600,
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#f8fafc" },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
      </Box>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.`

- [ ] **Step 5: Visual check**

At `/expense`: summary tiles are white with a small colored dot + bold amount; clicking a tile still navigates to details. At `/expense/details`: DataGrid has a slate header, row hover, rounded border; Back, Edit, Delete all still work.

- [ ] **Step 6: Commit**

```bash
git add src/pages/expense/expense.js src/pages/expense/details.js
git commit -m "feat(ui): muted expense category palette and styled data grid"
```

---

### Task 6: Camping filter bar + map info window

Clean up the filter/summary row and restyle the inline map info window as a themed card.

**Files:**
- Modify: `src/pages/camping/camping.js`

**Interfaces:**
- Consumes: `distance`/`duration`/`destination`/`curCity`/`filteredLocation`/`hoveredMarker` state and handlers (unchanged).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Add Paper import**

After line 13 (`import Button ...`), add:

```js
import Paper from "@mui/material/Paper";
```

- [ ] **Step 2: Replace the hovered-marker info window (lines 197-220)**

Replace the inline-styled `<div>` with a themed MUI `Paper` (keep the same absolute positioning and data fields):

```jsx
          {hoveredMarker && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                p: 1.5,
                borderRadius: 2,
                zIndex: 1000,
                maxWidth: 260,
              }}
            >
              <Typography fontWeight={"bold"} fontSize={14} pb={1}>
                {hoveredMarker.name}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                地址: {hoveredMarker.address}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Lat: {hoveredMarker.lat}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Lng: {hoveredMarker.lng}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                營位: {hoveredMarker.spot}
              </Typography>
            </Paper>
          )}
```

- [ ] **Step 3: Refine the summary text block (lines 126-146)**

Replace the `{destination ? (...) : (...)}` block's fallback and give the summary a subtle card feel:

```jsx
          {destination ? (
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction={"row"}>
                <Typography pr={2} fontWeight={"bold"} fontSize={14}>
                  From your location to:
                </Typography>
                <Typography fontSize={14}>{destination}</Typography>
              </Stack>
              <Stack direction={"row"}>
                <Typography pr={2} fontWeight={"bold"} fontSize={14}>
                  Distance:
                </Typography>
                <Typography fontSize={14}>
                  {distance}
                  {` (about ${duration} drive)`}
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Typography color="text.secondary">Let's find a place!</Typography>
          )}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.`

- [ ] **Step 5: Visual check**

At `/camping`: city filter + clear still work; hovering a marker shows a rounded themed card; selecting a marker shows the distance summary in a bordered card.

- [ ] **Step 6: Commit**

```bash
git add src/pages/camping/camping.js
git commit -m "feat(ui): polish Camping filter bar and map info window"
```

---

### Task 7: Profile welcome + NotFound

Typographic polish for the LINE-embedded welcome screen and an on-brand 404. Also fix the missing React `key` on the profile image map (low-risk correctness while here).

**Files:**
- Modify: `src/pages/profile/profile.js`
- Modify: `src/pages/notFound/NotFound.js`

**Interfaces:**
- Consumes: `user` prop (unchanged), profile slide assets (unchanged).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Polish the welcome text + add keys in `profile.js`**

Replace the `<p>` greeting (line 33) and add `key` to the mapped images (lines 34-42):

```jsx
        <>
          <Typography sx={{ p: 2, fontWeight: 600 }}>
            {`Hi ${user}, please check my profile below:`}
          </Typography>
          {pageList.map((list, index) => (
            <img
              key={`page-${index}`}
              src={list}
              alt={`page${index}`}
              width={"100%"}
              style={{ paddingBottom: 4 }}
            ></img>
          ))}
        </>
```

Add the import at the top if not present (Stack is already imported; add Typography):

```js
import Typography from "@mui/material/Typography";
```

- [ ] **Step 2: Replace `NotFound.js` with an on-brand 404**

```jsx
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NotFound = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography variant="h2" color="primary">
        404
      </Typography>
      <Typography variant="h6">Sorry, this page cannot be found.</Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 1 }}>
        Back to home
      </Button>
    </Box>
  );
};

export default NotFound;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.`

- [ ] **Step 4: Visual check**

Visit a bad URL (e.g. `/nope`): centered 404 with a "Back to home" button. Profile welcome text is styled (LIFF path can't be fully tested outside LINE, but the `user === undefined` welcome screen renders).

- [ ] **Step 5: Commit**

```bash
git add src/pages/profile/profile.js src/pages/notFound/NotFound.js
git commit -m "feat(ui): polish Profile welcome and NotFound page"
```

---

### Task 8: Booking consistency polish (keep brown/gold brand)

Do NOT re-skin to navy. Extract the repeated palette hexes into local constants for consistency and verify the brand still reads well against the new global font/reset.

**Files:**
- Modify: `src/pages/booking/booking.js`
- Modify: `src/pages/booking/BookingForm.js`

**Interfaces:**
- Consumes: existing booking state + `BookingForm` props (unchanged).
- Produces: local `BRAND` constants (module-local, not exported) — no cross-file contract change.

- [ ] **Step 1: Add brand constants at the top of `booking.js`**

After the imports, near the existing `const LARGE_PARTY_PHONE` (line 25), add:

```js
const BRAND = {
	brown: '#1f1b16',
	gold: '#d4a857',
	goldDark: '#c0973f',
	cream: '#fffdf8',
	creamText: '#f5e7c4',
	line: '#e8dec0',
};
```

- [ ] **Step 2: Replace the hardcoded hexes in `booking.js` with `BRAND.*`**

Swap each literal for its constant (no visual change, consistency only):
- `bgcolor: '#fffdf8'` → `bgcolor: BRAND.cream` (2 occurrences: Paper line 132, footer line 235)
- `bgcolor: '#1f1b16'` → `bgcolor: BRAND.brown` (header line 138)
- `color: '#f5e7c4'` → `color: BRAND.creamText` (header line 139)
- `color: '#d4a857'` → `color: BRAND.gold` (icon line 149)
- reset button `borderColor`/`color` `'#1f1b16'` → `BRAND.brown`, hover `bgcolor: '#f5e7c4'` → `BRAND.creamText`
- `borderTop: '1px solid #e8dec0'` → `borderTop: \`1px solid ${BRAND.line}\``
- CTA `bgcolor: '#d4a857'` → `BRAND.gold`, `color: '#1f1b16'` → `BRAND.brown`, hover `'#c0973f'` → `BRAND.goldDark`

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: `Compiled successfully.`

- [ ] **Step 4: Visual check**

At `/booking`: identical brown/gold appearance to before (this task is a no-visual-change refactor + font-reset sanity check). Confirm the reserve flow still shows the success alert. At `/booking/manage`: still renders and functions.

- [ ] **Step 5: Commit**

```bash
git add src/pages/booking/booking.js src/pages/booking/BookingForm.js
git commit -m "refactor(ui): extract booking brand constants; keep restaurant identity"
```

---

### Task 9: Update CLAUDE.md

Document the new design-system entry point per the repo's "keep CLAUDE.md current" convention.

**Files:**
- Modify: `CLAUDE.md` (Architecture section)

**Interfaces:** none.

- [ ] **Step 1: Add a UI/theme note to `CLAUDE.md`**

Under the **Architecture** section, add a paragraph (place it near the "UI library" bullet):

```markdown
**Design system** — Global styling flows from a single MUI theme in [src/theme.js](src/theme.js), applied via `ThemeProvider` + `CssBaseline` at the App root ([src/App.js](src/App.js)). The dashboard pages (Home, Recipe, Expense, Camping, Profile, 404) use a navy/slate palette with the Inter font (loaded via `@import` in [src/index.css](src/index.css)). The **Booking** feature intentionally keeps a separate warm brown/gold restaurant brand (`#1f1b16`/`#d4a857`/`#fffdf8`) and is NOT themed by `src/theme.js` — treat it as a distinct visual identity when editing.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document theme.js design system and booking brand exception"
```

---

## Self-Review

**Spec coverage:**
- Central theme → Task 1 ✓
- Global CSS + navbar → Task 2 ✓
- Home dashboard → Task 3 ✓
- Recipe → Task 4 ✓
- Expense + details → Task 5 ✓
- Camping → Task 6 ✓
- Profile + NotFound → Task 7 ✓
- Booking keep-brand polish → Task 8 ✓
- CLAUDE.md follow-up → Task 9 ✓
- Shared expense/general dialogs: inherit theme automatically (Task 1); no dedicated task needed since spec marked touch-ups "only if needed."

**Placeholder scan:** No TBD/TODO; all code steps contain concrete code. ✓

**Type/name consistency:** `color` map keys in Task 5 unchanged (preserves `details.js` filtering); `BRAND` constants in Task 8 are module-local; theme default export `theme` consumed consistently in Task 1. ✓

**Non-goals respected:** no new deps, no dark mode, no booking navy re-skin, no logic changes. ✓
