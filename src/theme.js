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
