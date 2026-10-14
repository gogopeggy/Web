import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const PLACEHOLDER = '—';

// Booking keeps a separate warm restaurant identity (see CLAUDE.md), so the
// strip is tinted to match rather than dropping a slate band onto that page.
const PALETTES = {
	slate: {
		bg: '#f1f5f9',
		border: '#e2e8f0',
		text: '#64748b',
		strong: '#1e293b',
		divider: '#cbd5e1',
	},
	booking: {
		bg: '#fffdf8',
		border: '#e8dcc4',
		text: '#7a6a52',
		strong: '#1f1b16',
		divider: '#ddd0b4',
	},
};

// Below this width the temperature range drops out so the bar stays one line.
const NARROW = '@media (max-width:379.95px)';

export default function WeatherBar() {
	const weather = useSelector((state) => state.user.weather);
	const { pathname } = useLocation();
	const c = pathname.startsWith('/booking') ? PALETTES.booking : PALETTES.slate;

	const main = weather && weather.main;
	const des = weather && weather.des && weather.des[0];

	const city = (weather && weather.name) || PLACEHOLDER;
	const temp = main ? `${Math.round(main.temp)}°C` : PLACEHOLDER;
	const description = des ? des.description : PLACEHOLDER;
	const feelsLike = main ? `體感 ${Math.round(main.feels_like)}°` : PLACEHOLDER;
	const range = main
		? `${Math.round(main.temp_min)}° / ${Math.round(main.temp_max)}°`
		: PLACEHOLDER;

	const Divider = ({ narrowOnly }) => (
		<Box
			component='span'
			sx={{
				width: '1px',
				height: 12,
				flex: 'none',
				bgcolor: c.divider,
				...(narrowOnly ? { [NARROW]: { display: 'none' } } : null),
			}}
		/>
	);

	const iconSx = { fontSize: 14, opacity: 0.75, flex: 'none' };

	return (
		<Box
			className='weather-bar'
			sx={{
				bgcolor: c.bg,
				borderBottom: `1px solid ${c.border}`,
				color: c.text,
				fontSize: 12.5,
				overflow: 'hidden',
			}}
		>
			<Box
				sx={{
					maxWidth: 900,
					mx: 'auto',
					px: { xs: 1.5, sm: 2.5 },
					py: 0.75,
					display: 'flex',
					alignItems: 'center',
					gap: { xs: 0.875, sm: 1.25 },
					whiteSpace: 'nowrap',
				}}
			>
				<Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
					<LocationOnIcon sx={iconSx} />
					<Box component='span' sx={{ color: c.strong, fontWeight: 600 }}>
						{city}
					</Box>
				</Box>

				<Divider />

				<Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
					<WbSunnyIcon sx={iconSx} />
					<Box component='span' sx={{ color: c.strong, fontWeight: 600, fontSize: 13 }}>
						{temp}
					</Box>
				</Box>

				<Box component='span'>{description}</Box>

				<Divider />

				<Box component='span'>{feelsLike}</Box>

				<Divider narrowOnly />

				<Box component='span' sx={{ [NARROW]: { display: 'none' } }}>
					{range}
				</Box>
			</Box>
		</Box>
	);
}
