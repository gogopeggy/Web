import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import 'moment/locale/zh-tw';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import SetMealIcon from '@mui/icons-material/SetMeal';
import BookingForm, { emptyBookingValue } from './BookingForm';
import {
	getBlockedDates,
	getBookings,
	getCapacity,
	saveBooking,
	validateBooking,
	computeDayStats,
	computeFullDates,
} from './storage';
import { sendBookingConfirmation } from './email';

const LARGE_PARTY_PHONE = '+886 1131415';

export default function Booking() {
	const [value, setValue] = useState(
		emptyBookingValue({ date: moment().add(1, 'day').startOf('day') })
	);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState(false);
	const [blockedDates, setBlockedDates] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [capacity, setCapacityState] = useState({ lunch: 10, dinner: 10 });
	const [confirmed, setConfirmed] = useState(null);

	useEffect(() => {
		setBlockedDates(getBlockedDates());
		setBookings(getBookings());
		setCapacityState(getCapacity());
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	}, []);

	const fullDates = useMemo(
		() => computeFullDates(computeDayStats(bookings), capacity),
		[bookings, capacity]
	);

	const handleChange = (next) => {
		setValue(next);
		if (touched) setErrors(validateBooking(next));
	};

	const handleReserve = () => {
		const errs = validateBooking(value);
		setErrors(errs);
		setTouched(true);
		if (Object.keys(errs).length > 0) return;

		const [h, m] = value.time.split(':').map(Number);
		const when = value.date.clone().hour(h).minute(m);
		const record = saveBooking({
			date: value.date.format('YYYY-MM-DD'),
			time: value.time,
			adults: value.adults,
			children: value.children,
			name: value.name.trim(),
			phone: value.phone.trim(),
			email: value.email.trim(),
		});
		sendBookingConfirmation(record);
		setConfirmed({
			id: record.id,
			display: when.locale('zh-tw').format('YYYY 年 M 月 D 日 dddd HH:mm'),
			adults: value.adults,
			children: value.children,
		});
	};

	const handleReset = () => {
		setConfirmed(null);
		setErrors({});
		setTouched(false);
		setValue(
			emptyBookingValue({ date: moment().add(1, 'day').startOf('day') })
		);
	};

	const partySummary = () => {
		if (!confirmed) return '';
		let s = `${confirmed.adults} 位大人`;
		if (confirmed.children > 0) s += `、${confirmed.children} 位小孩`;
		return s;
	};

	return (
		<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='zh-tw'>
			<Box
				sx={{
					width: '100vw',
					position: 'relative',
					left: '50%',
					right: '50%',
					ml: '-50vw',
					mr: '-50vw',
					height: 'calc(100dvh - 80px)',
					maxHeight: 900,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: { xs: 1.5, sm: 2 },
					py: { xs: 1, sm: 2 },
					px: { xs: 1.5, sm: 2 },
					boxSizing: 'border-box',
					overflowX: 'hidden',
				}}
			>
				<Paper
					elevation={6}
					sx={{
						flex: 1,
						minHeight: 0,
						width: '100%',
						maxWidth: 480,
						display: 'flex',
						flexDirection: 'column',
						borderRadius: { xs: 2, sm: 3 },
						overflow: 'hidden',
						bgcolor: '#fffdf8',
					}}
				>
					<Box
						sx={{
							flexShrink: 0,
							bgcolor: '#1f1b16',
							color: '#f5e7c4',
							px: { xs: 3, sm: 4 },
							py: { xs: 2, sm: 3 },
							textAlign: 'center',
						}}
					>
						<SetMealIcon
							sx={{
								fontSize: { xs: 28, sm: 36 },
								mb: 0.5,
								color: '#d4a857',
							}}
						/>
						<Typography
							sx={{
								fontWeight: 600,
								letterSpacing: 2,
								fontSize: { xs: 22, sm: 30 },
								lineHeight: 1.2,
							}}
						>
							漁家莊
						</Typography>
						<Typography variant='body2' sx={{ mt: 0.5, opacity: 0.75 }}>
							期待為您服務
						</Typography>
					</Box>

					<Box
						sx={{
							flex: 1,
							minHeight: 0,
							overflowY: 'auto',
							p: { xs: 2.5, sm: 4 },
						}}
					>
						{confirmed ? (
							<Stack spacing={2}>
								<Alert severity='success' sx={{ borderRadius: 2 }}>
									訂位成功！<b>{confirmed.display}</b>，共{' '}
									<b>{partySummary()}</b>。
								</Alert>
								<Button
									variant='outlined'
									onClick={handleReset}
									sx={{
										borderColor: '#1f1b16',
										color: '#1f1b16',
										'&:hover': {
											borderColor: '#1f1b16',
											bgcolor: '#f5e7c4',
										},
									}}
								>
									再次訂位
								</Button>
							</Stack>
						) : (
							<Stack spacing={3}>
								<BookingForm
									value={value}
									onChange={handleChange}
									blockedDates={blockedDates}
									fullDates={fullDates}
									errors={errors}
								/>

								<Typography
									variant='caption'
									sx={{ color: '#9a8c6c', display: 'block' }}
								>
									超過 12 人之訂位，請來電：{' '}
									<Box
										component='a'
										href={`tel:${LARGE_PARTY_PHONE.replace(/\s/g, '')}`}
										sx={{
											color: '#1f1b16',
											fontWeight: 600,
											textDecoration: 'none',
											'&:hover': { textDecoration: 'underline' },
										}}
									>
										{LARGE_PARTY_PHONE}
									</Box>
								</Typography>
							</Stack>
						)}
					</Box>

					{!confirmed && (
						<Box
							sx={{
								flexShrink: 0,
								px: { xs: 2.5, sm: 4 },
								py: { xs: 1.5, sm: 2 },
								borderTop: '1px solid #e8dec0',
								bgcolor: '#fffdf8',
							}}
						>
							<Button
								fullWidth
								variant='contained'
								onClick={handleReserve}
								sx={{
									py: 1.5,
									bgcolor: '#d4a857',
									color: '#1f1b16',
									fontWeight: 700,
									letterSpacing: 2,
									borderRadius: 2,
									boxShadow: 'none',
									'&:hover': { bgcolor: '#c0973f', boxShadow: 'none' },
								}}
							>
								立即訂位
							</Button>
						</Box>
					)}
				</Paper>

			</Box>
		</LocalizationProvider>
	);
}
