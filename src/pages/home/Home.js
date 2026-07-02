import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Home() {
	const today = moment().format('L');
	const [date, setDate] = useState(new Date());
	const weather = useSelector((state) => state.user.weather);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setDate(new Date());
		}, 1000);

		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
								weather.main ? `${parseInt(weather.main.temp)}\u00b0C` : null
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
									? `${parseInt(weather.main.feels_like)}\u00b0C`
									: null
							}
						/>
						<WeatherTile
							label='Temp range'
							value={
								weather.main
									? `${parseInt(weather.main.temp_min)}-${parseInt(
											weather.main.temp_max
									  )}\u00b0C`
									: null
							}
						/>
					</Grid>
				</CardContent>
			</Card>
		</Box>
	);
}
