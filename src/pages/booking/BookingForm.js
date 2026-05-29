import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';

function CustomDay(props) {
	const { day, blockedDates = [], fullDates = [], sx: customSx, ...other } =
		props;
	const dateStr = day && day.format ? day.format('YYYY-MM-DD') : '';
	const isBlocked = blockedDates.includes(dateStr);
	const isFull = !isBlocked && fullDates.includes(dateStr);
	const label = isBlocked ? '公休' : isFull ? '滿' : null;

	return (
		<Box
			sx={{
				display: 'inline-flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: 44,
			}}
		>
			<PickersDay
				{...other}
				day={day}
				sx={{
					...(customSx || {}),
					width: 40,
					height: 40,
					fontSize: 15,
					fontWeight: 600,
				}}
			/>
			<Typography
				sx={{
					fontSize: 12,
					fontWeight: 700,
					color: '#b54a36',
					lineHeight: 1,
					height: 14,
					visibility: label ? 'visible' : 'hidden',
				}}
			>
				{label || ' '}
			</Typography>
		</Box>
	);
}

export const MIN_ADULTS = 1;
export const MAX_TOTAL = 12;
export const LUNCH_SLOTS = ['11:00', '11:30', '12:00', '12:30', '13:00'];
export const DINNER_SLOTS = ['17:00', '17:30', '18:00', '18:30', '19:00'];

function SectionLabel({ icon: Icon, children }) {
	return (
		<Stack direction='row' alignItems='center' spacing={1} mb={1}>
			<Icon sx={{ color: '#7a6a4a' }} fontSize='small' />
			<Typography
				variant='subtitle2'
				sx={{ color: '#7a6a4a', letterSpacing: 1 }}
			>
				{children}
			</Typography>
		</Stack>
	);
}

function Counter({ label, value, onSub, onAdd, disableSub, disableAdd }) {
	return (
		<Stack
			direction='row'
			alignItems='center'
			justifyContent='space-between'
			sx={{ border: '1px solid #d8cdb3', borderRadius: 2, px: 2, py: 1 }}
		>
			<Typography
				variant='body2'
				sx={{ fontWeight: 600, color: '#1f1b16' }}
			>
				{label}
			</Typography>
			<Stack direction='row' alignItems='center' spacing={1.5}>
				<IconButton
					onClick={onSub}
					disabled={disableSub}
					size='small'
					sx={{ color: '#1f1b16' }}
				>
					<RemoveIcon fontSize='small' />
				</IconButton>
				<Typography
					variant='h6'
					sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}
				>
					{value}
				</Typography>
				<IconButton
					onClick={onAdd}
					disabled={disableAdd}
					size='small'
					sx={{ color: '#1f1b16' }}
				>
					<AddIcon fontSize='small' />
				</IconButton>
			</Stack>
		</Stack>
	);
}

function TimeSlots({ slots, selected, onSelect }) {
	return (
		<Stack direction='row' flexWrap='wrap' gap={1}>
			{slots.map((slot) => {
				const active = slot === selected;
				return (
					<Button
						key={slot}
						onClick={() => onSelect(slot)}
						variant={active ? 'contained' : 'outlined'}
						disableElevation
						sx={{
							minWidth: 76,
							py: 0.8,
							fontWeight: 600,
							borderRadius: 1.5,
							bgcolor: active ? '#d4a857' : 'transparent',
							color: '#1f1b16',
							borderColor: active ? '#d4a857' : '#d8cdb3',
							'&:hover': {
								bgcolor: active ? '#c0973f' : '#f5e7c4',
								borderColor: '#d4a857',
							},
						}}
					>
						{slot}
					</Button>
				);
			})}
		</Stack>
	);
}

export default function BookingForm({
	value,
	onChange,
	blockedDates = [],
	fullDates = [],
	errors = {},
}) {
	const { date, time, adults, children, name, phone, email } = value;
	const total = adults + children;
	const atCap = total >= MAX_TOTAL;

	const set = (patch) => onChange({ ...value, ...patch });

	const adjustAdults = (delta) => {
		const next = adults + delta;
		if (next < MIN_ADULTS) return;
		if (next + children > MAX_TOTAL) return;
		set({ adults: next });
	};

	const adjustChildren = (delta) => {
		const next = children + delta;
		if (next < 0) return;
		if (next + adults > MAX_TOTAL) return;
		set({ children: next });
	};

	const shouldDisableDate = (d) => {
		const ds = d.format('YYYY-MM-DD');
		return blockedDates.includes(ds) || fullDates.includes(ds);
	};

	return (
		<Stack spacing={3}>
			<Box>
				<SectionLabel icon={EventIcon}>用餐日期</SectionLabel>
				<MobileDatePicker
					value={date}
					onChange={(v) => v && set({ date: v })}
					disablePast
					shouldDisableDate={shouldDisableDate}
					format='YYYY-MM-DD'
					slots={{ day: CustomDay }}
					slotProps={{
						textField: { fullWidth: true, size: 'medium' },
						day: { blockedDates, fullDates },
						dialog: {
							sx: {
								'& .MuiPickersLayout-root': {
									minWidth: 340,
								},
								'& .MuiDayCalendar-weekDayLabel': {
									width: 44,
									height: 40,
									fontSize: 13,
									fontWeight: 600,
									margin: 0,
								},
								'& .MuiDayCalendar-weekContainer': {
									margin: 0,
								},
								'& .MuiPickersSlideTransition-root': {
									minHeight: 300,
								},
							},
						},
					}}
				/>
			</Box>

			<Divider />

			<Box>
				<SectionLabel icon={ScheduleIcon}>用餐時段</SectionLabel>
				<Stack spacing={1.5}>
					<Box>
						<Typography
							variant='caption'
							sx={{ color: '#9a8c6c', display: 'block', mb: 0.5 }}
						>
							午餐
						</Typography>
						<TimeSlots
							slots={LUNCH_SLOTS}
							selected={time}
							onSelect={(t) => set({ time: t })}
						/>
					</Box>
					<Box>
						<Typography
							variant='caption'
							sx={{ color: '#9a8c6c', display: 'block', mb: 0.5 }}
						>
							晚餐
						</Typography>
						<TimeSlots
							slots={DINNER_SLOTS}
							selected={time}
							onSelect={(t) => set({ time: t })}
						/>
					</Box>
				</Stack>
			</Box>

			<Divider />

			<Box>
				<SectionLabel icon={GroupIcon}>用餐人數</SectionLabel>
				<Stack spacing={1.5}>
					<Counter
						label='大人'
						value={adults}
						onSub={() => adjustAdults(-1)}
						onAdd={() => adjustAdults(1)}
						disableSub={adults <= MIN_ADULTS}
						disableAdd={atCap}
					/>
					<Counter
						label='小孩'
						value={children}
						onSub={() => adjustChildren(-1)}
						onAdd={() => adjustChildren(1)}
						disableSub={children <= 0}
						disableAdd={atCap}
					/>
				</Stack>
			</Box>

			<Divider />

			<Box>
				<SectionLabel icon={PersonIcon}>聯絡資訊</SectionLabel>
				<Stack spacing={2}>
					<TextField
						label='姓名'
						required
						fullWidth
						value={name}
						onChange={(e) => set({ name: e.target.value })}
						error={!!errors.name}
						helperText={errors.name || ' '}
					/>
					<TextField
						label='聯絡電話'
						required
						fullWidth
						value={phone}
						onChange={(e) => set({ phone: e.target.value })}
						error={!!errors.phone}
						helperText={errors.phone || ' '}
						placeholder='09XX-XXX-XXX'
					/>
					<TextField
						label='電子郵件（選填）'
						type='email'
						fullWidth
						value={email}
						onChange={(e) => set({ email: e.target.value })}
						error={!!errors.email}
						helperText={errors.email || ' '}
					/>
				</Stack>
			</Box>
		</Stack>
	);
}

export const emptyBookingValue = (overrides = {}) => ({
	date: null,
	time: '18:00',
	adults: 2,
	children: 0,
	name: '',
	phone: '',
	email: '',
	...overrides,
});
