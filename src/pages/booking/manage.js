import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-tw';
import {
	DatePicker,
	LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import BookingForm, {
	emptyBookingValue,
	LUNCH_SLOTS,
	DINNER_SLOTS,
} from './BookingForm';
import {
	getBookings,
	saveBooking,
	updateBooking,
	deleteBooking,
	getBlockedDates,
	addBlockedDate,
	removeBlockedDate,
	getCapacity,
	setCapacity,
	computeDayStats,
	computeFullDates,
	validateBooking,
	seedDummyBookings,
	clearAllBookings,
} from './storage';

const WEEK_HEADERS = ['日', '一', '二', '三', '四', '五', '六'];

const cellStyleFor = (lunchFull, dinnerFull, anyBookings, isBlocked) => {
	if (isBlocked) return { bg: '#e0e0e0', border: '#bdbdbd' };
	if (lunchFull && dinnerFull) return { bg: '#ffcdd2', border: '#ef9a9a' };
	if (!anyBookings) return { bg: '#e8f5e9', border: '#a5d6a7' };
	if (lunchFull || dinnerFull) return { bg: '#ffe0b2', border: '#ffb74d' };
	return { bg: '#fff8e1', border: '#ffe082' };
};

function LegendDot({ color, border, label }) {
	return (
		<Stack direction='row' spacing={0.5} alignItems='center'>
			<Box
				sx={{
					width: 14,
					height: 14,
					borderRadius: 0.5,
					bgcolor: color,
					border: `1px solid ${border}`,
				}}
			/>
			<Typography variant='caption' sx={{ color: '#7a6a4a' }}>
				{label}
			</Typography>
		</Stack>
	);
}

function SlotRow({ time, booking, onEdit, onDelete, onAdd }) {
	const booked = !!booking;
	return (
		<Stack
			direction='row'
			alignItems='center'
			spacing={1.5}
			sx={{
				p: 1.5,
				borderRadius: 1.5,
				bgcolor: booked ? '#ffebee' : '#e8f5e9',
				border: '1px solid',
				borderColor: booked ? '#ef9a9a' : '#a5d6a7',
			}}
		>
			<Typography
				sx={{
					fontWeight: 700,
					minWidth: 52,
					fontSize: 15,
					color: '#1f1b16',
				}}
			>
				{time}
			</Typography>
			{booked ? (
				<>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography
							sx={{ fontWeight: 600, color: '#1f1b16' }}
							noWrap
						>
							{booking.name}
						</Typography>
						<Typography variant='caption' sx={{ color: '#7a6a4a' }}>
							共 {booking.adults} 位大人
							{booking.children > 0
								? `、${booking.children} 位小孩`
								: ''}
							{booking.phone ? ` · ${booking.phone}` : ''}
						</Typography>
					</Box>
					<IconButton
						size='small'
						onClick={() => onEdit(booking)}
						sx={{ color: '#1f1b16' }}
					>
						<EditIcon fontSize='small' />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => onDelete(booking)}
						sx={{ color: '#b54a36' }}
					>
						<DeleteOutlineIcon fontSize='small' />
					</IconButton>
				</>
			) : (
				<>
					<Typography
						variant='body2'
						sx={{ color: '#2e7d32', fontWeight: 600, flex: 1 }}
					>
						可訂位
					</Typography>
					<IconButton
						size='small'
						onClick={() => onAdd(time)}
						sx={{
							color: '#1f1b16',
							bgcolor: '#d4a857',
							'&:hover': { bgcolor: '#c0973f' },
						}}
					>
						<AddIcon fontSize='small' />
					</IconButton>
				</>
			)}
		</Stack>
	);
}

function DayDetailDialog({
	day,
	bookings,
	isBlocked,
	onClose,
	onEdit,
	onDelete,
	onAdd,
}) {
	if (!day) return null;
	const title = day.locale('zh-tw').format('YYYY 年 M 月 D 日 (dddd)');
	const findBooking = (slot) => bookings.find((b) => b.time === slot);

	return (
		<Dialog open onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
			<DialogContent dividers>
				{isBlocked ? (
					<Alert severity='info'>此日為公休日，不開放訂位</Alert>
				) : (
					<Stack spacing={1}>
						<Typography
							variant='caption'
							sx={{
								color: '#7a6a4a',
								fontWeight: 700,
								letterSpacing: 1,
							}}
						>
							午餐
						</Typography>
						{LUNCH_SLOTS.map((slot) => (
							<SlotRow
								key={slot}
								time={slot}
								booking={findBooking(slot)}
								onEdit={onEdit}
								onDelete={onDelete}
								onAdd={(t) => onAdd(day, t)}
							/>
						))}
						<Typography
							variant='caption'
							sx={{
								color: '#7a6a4a',
								fontWeight: 700,
								letterSpacing: 1,
								mt: 1,
							}}
						>
							晚餐
						</Typography>
						{DINNER_SLOTS.map((slot) => (
							<SlotRow
								key={slot}
								time={slot}
								booking={findBooking(slot)}
								onEdit={onEdit}
								onDelete={onDelete}
								onAdd={(t) => onAdd(day, t)}
							/>
						))}
					</Stack>
				)}
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={onClose}
					sx={{ color: '#7a6a4a', '&:hover': { bgcolor: '#f5e7c4' } }}
				>
					關閉
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function BookingDialog({
	open,
	title,
	initial,
	blockedDates,
	fullDates,
	onClose,
	onSave,
}) {
	const fallback = useMemo(() => initial || emptyBookingValue(), [initial]);
	const [value, setValue] = useState(fallback);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		setValue(fallback);
		setErrors({});
		setTouched(false);
	}, [fallback, open]);

	const handleChange = (next) => {
		setValue(next);
		if (touched) setErrors(validateBooking(next));
	};

	const handleSave = () => {
		const errs = validateBooking(value);
		setErrors(errs);
		setTouched(true);
		if (Object.keys(errs).length > 0) return;
		onSave({
			date: value.date.format('YYYY-MM-DD'),
			time: value.time,
			adults: value.adults,
			children: value.children,
			name: value.name.trim(),
			phone: value.phone.trim(),
			email: value.email.trim(),
		});
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ pt: 1 }}>
					<BookingForm
						value={value}
						onChange={handleChange}
						blockedDates={blockedDates}
						fullDates={fullDates}
						errors={errors}
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={onClose}
					sx={{ color: '#7a6a4a', '&:hover': { bgcolor: '#f5e7c4' } }}
				>
					取消
				</Button>
				<Button
					onClick={handleSave}
					variant='contained'
					disableElevation
					sx={{
						bgcolor: '#d4a857',
						color: '#1f1b16',
						fontWeight: 700,
						'&:hover': { bgcolor: '#c0973f' },
					}}
				>
					儲存
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function CalendarTab({ bookings, blockedDates, capacity, onChanged }) {
	const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
	const [selectedDay, setSelectedDay] = useState(null);
	const [dialog, setDialog] = useState(null);

	const days = useMemo(() => {
		const monthStart = currentMonth.clone().startOf('month');
		const monthEnd = currentMonth.clone().endOf('month');
		const gridStart = monthStart.clone().startOf('week');
		const gridEnd = monthEnd.clone().endOf('week');
		const out = [];
		const cur = gridStart.clone();
		while (cur.isSameOrBefore(gridEnd, 'day')) {
			out.push(cur.clone());
			cur.add(1, 'day');
		}
		return out;
	}, [currentMonth]);

	const byDate = useMemo(() => {
		const map = {};
		bookings.forEach((b) => {
			if (!map[b.date]) map[b.date] = [];
			map[b.date].push(b);
		});
		return map;
	}, [bookings]);

	const stats = useMemo(() => computeDayStats(bookings), [bookings]);
	const fullDates = useMemo(
		() => computeFullDates(stats, capacity),
		[stats, capacity]
	);

	const handleSeed = () => {
		seedDummyBookings();
		onChanged();
	};

	const handleClearAll = () => {
		if (window.confirm('確定要清除全部訂位記錄？')) {
			clearAllBookings();
			onChanged();
		}
	};

	const handleDelete = (b) => {
		if (window.confirm('確定要取消此訂位？')) {
			deleteBooking(b.id);
			onChanged();
		}
	};

	const openEdit = (booking) => {
		setDialog({
			title: '編輯訂位',
			initial: {
				date: moment(booking.date, 'YYYY-MM-DD'),
				time: booking.time,
				adults: booking.adults,
				children: booking.children,
				name: booking.name,
				phone: booking.phone,
				email: booking.email || '',
			},
			onSave: (data) => {
				updateBooking(booking.id, data);
				setDialog(null);
				onChanged();
			},
		});
	};

	const openAdd = (day, time) => {
		setDialog({
			title: '新增訂位',
			initial: emptyBookingValue({ date: day.clone(), time }),
			onSave: (data) => {
				saveBooking(data);
				setDialog(null);
				onChanged();
			},
		});
	};

	const selectedDateStr = selectedDay
		? selectedDay.format('YYYY-MM-DD')
		: null;
	const selectedDayBookings = selectedDateStr
		? byDate[selectedDateStr] || []
		: [];
	const selectedDayBlocked =
		selectedDateStr && blockedDates.includes(selectedDateStr);

	return (
		<Stack spacing={2}>
			<Stack
				direction='row'
				spacing={1}
				justifyContent='flex-end'
				sx={{
					p: 1,
					borderRadius: 2,
					bgcolor: '#f5e7c4',
					border: '1px dashed #d4a857',
				}}
			>
				<Typography
					variant='caption'
					sx={{
						flex: 1,
						color: '#7a6a4a',
						alignSelf: 'center',
						pl: 1,
					}}
				>
					測試工具
				</Typography>
				<Button
					size='small'
					onClick={handleSeed}
					sx={{ color: '#1f1b16', fontWeight: 600 }}
				>
					載入測試資料
				</Button>
				<Button
					size='small'
					onClick={handleClearAll}
					disabled={bookings.length === 0}
					sx={{ color: '#b54a36', fontWeight: 600 }}
				>
					清除全部
				</Button>
			</Stack>

			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				spacing={1}
			>
				<IconButton
					onClick={() =>
						setCurrentMonth(currentMonth.clone().subtract(1, 'month'))
					}
					sx={{ color: '#1f1b16' }}
				>
					<ChevronLeftIcon />
				</IconButton>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={1}
					alignItems='center'
				>
					<DatePicker
						views={['year', 'month']}
						value={currentMonth}
						onChange={(v) => v && setCurrentMonth(v.startOf('month'))}
						format='YYYY 年 M 月'
						slotProps={{
							textField: {
								size: 'small',
								sx: { width: { xs: 140, sm: 160 } },
							},
						}}
					/>
					<Button
						size='small'
						variant='outlined'
						onClick={() => setCurrentMonth(moment().startOf('month'))}
						sx={{
							borderColor: '#1f1b16',
							color: '#1f1b16',
							'&:hover': {
								borderColor: '#1f1b16',
								bgcolor: '#f5e7c4',
							},
						}}
					>
						今天
					</Button>
				</Stack>
				<IconButton
					onClick={() =>
						setCurrentMonth(currentMonth.clone().add(1, 'month'))
					}
					sx={{ color: '#1f1b16' }}
				>
					<ChevronRightIcon />
				</IconButton>
			</Stack>

			<Stack
				direction='row'
				spacing={1.5}
				flexWrap='wrap'
				justifyContent='center'
				rowGap={0.5}
			>
				<LegendDot color='#e8f5e9' border='#a5d6a7' label='可訂位' />
				<LegendDot color='#fff8e1' border='#ffe082' label='少量訂位' />
				<LegendDot color='#ffe0b2' border='#ffb74d' label='較多訂位' />
				<LegendDot color='#ffcdd2' border='#ef9a9a' label='已客滿' />
				<LegendDot color='#e0e0e0' border='#bdbdbd' label='公休' />
			</Stack>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(7, 1fr)',
					gap: 0.5,
				}}
			>
				{WEEK_HEADERS.map((w) => (
					<Typography
						key={w}
						variant='caption'
						sx={{
							textAlign: 'center',
							fontWeight: 700,
							color: '#7a6a4a',
							py: 0.5,
						}}
					>
						{w}
					</Typography>
				))}
				{days.map((d) => {
					const dateStr = d.format('YYYY-MM-DD');
					const isCurMonth = d.month() === currentMonth.month();
					const isToday = d.isSame(moment(), 'day');
					const isBlocked = blockedDates.includes(dateStr);
					const dayStats =
						stats[dateStr] || {
							lunch: { people: 0, groups: 0 },
							dinner: { people: 0, groups: 0 },
						};
					const lunchFull = dayStats.lunch.people >= capacity.lunch;
					const dinnerFull = dayStats.dinner.people >= capacity.dinner;
					const anyBookings =
						dayStats.lunch.groups > 0 || dayStats.dinner.groups > 0;
					const { bg, border } = cellStyleFor(
						lunchFull,
						dinnerFull,
						anyBookings,
						isBlocked
					);

					return (
						<Box
							key={dateStr}
							onClick={() => setSelectedDay(d)}
							sx={{
								minHeight: { xs: 62, sm: 82 },
								bgcolor: isCurMonth ? bg : '#fafafa',
								opacity: isCurMonth ? 1 : 0.45,
								borderRadius: 1,
								border: '1px solid',
								borderColor: isToday ? '#d4a857' : border,
								outline: isToday ? '1px solid #d4a857' : 'none',
								p: { xs: 0.5, sm: 0.75 },
								display: 'flex',
								flexDirection: 'column',
								cursor: 'pointer',
								transition: 'transform 0.1s',
								'&:hover': {
									transform: 'translateY(-1px)',
									boxShadow: 2,
								},
							}}
						>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: { xs: 12, sm: 13 },
									color: '#1f1b16',
									lineHeight: 1,
								}}
							>
								{d.date()}
							</Typography>
							{isBlocked ? (
								<Typography
									sx={{
										mt: 'auto',
										textAlign: 'right',
										fontSize: { xs: 9, sm: 10 },
										color: '#666',
										fontWeight: 600,
									}}
								>
									公休
								</Typography>
							) : anyBookings ? (
								<Box sx={{ mt: 'auto', lineHeight: 1.2 }}>
									<Typography
										sx={{
											fontSize: { xs: 9, sm: 10 },
											fontWeight: 600,
											color: lunchFull ? '#b54a36' : '#1f1b16',
										}}
									>
										午 {dayStats.lunch.people}人 {dayStats.lunch.groups}組
									</Typography>
									<Typography
										sx={{
											fontSize: { xs: 9, sm: 10 },
											fontWeight: 600,
											color: dinnerFull ? '#b54a36' : '#1f1b16',
										}}
									>
										晚 {dayStats.dinner.people}人{' '}
										{dayStats.dinner.groups}組
									</Typography>
								</Box>
							) : null}
						</Box>
					);
				})}
			</Box>

			<DayDetailDialog
				day={selectedDay}
				bookings={selectedDayBookings}
				isBlocked={selectedDayBlocked}
				onClose={() => setSelectedDay(null)}
				onEdit={openEdit}
				onDelete={handleDelete}
				onAdd={openAdd}
			/>

			<BookingDialog
				open={!!dialog}
				title={dialog?.title}
				initial={dialog?.initial}
				blockedDates={blockedDates}
				fullDates={fullDates}
				onClose={() => setDialog(null)}
				onSave={dialog?.onSave}
			/>
		</Stack>
	);
}

function AdminTab({ blockedDates, capacity, onChanged }) {
	const [pickerDate, setPickerDate] = useState(moment().startOf('day'));
	const [lunchCap, setLunchCap] = useState(String(capacity.lunch));
	const [dinnerCap, setDinnerCap] = useState(String(capacity.dinner));

	useEffect(() => {
		setLunchCap(String(capacity.lunch));
		setDinnerCap(String(capacity.dinner));
	}, [capacity.lunch, capacity.dinner]);

	const capacityChanged =
		parseInt(lunchCap, 10) !== capacity.lunch ||
		parseInt(dinnerCap, 10) !== capacity.dinner;

	const handleSaveCapacity = () => {
		setCapacity({ lunch: lunchCap, dinner: dinnerCap });
		onChanged();
	};

	const handleBlock = () => {
		if (!pickerDate) return;
		addBlockedDate(pickerDate.format('YYYY-MM-DD'));
		onChanged();
	};

	const handleUnblock = (d) => {
		removeBlockedDate(d);
		onChanged();
	};

	return (
		<Stack spacing={3}>
			<Box>
				<Typography
					variant='subtitle2'
					sx={{ color: '#7a6a4a', letterSpacing: 1, mb: 1 }}
				>
					每日用餐人數上限
				</Typography>
				<Typography variant='body2' sx={{ color: '#9a8c6c', mb: 2 }}>
					達到上限的日期將顯示「滿」並無法選取訂位。
				</Typography>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={1.5}
					alignItems={{ xs: 'stretch', sm: 'flex-start' }}
				>
					<TextField
						label='午餐上限（人數）'
						type='number'
						size='small'
						value={lunchCap}
						onChange={(e) => setLunchCap(e.target.value)}
						inputProps={{ min: 1 }}
						sx={{ flex: 1 }}
					/>
					<TextField
						label='晚餐上限（人數）'
						type='number'
						size='small'
						value={dinnerCap}
						onChange={(e) => setDinnerCap(e.target.value)}
						inputProps={{ min: 1 }}
						sx={{ flex: 1 }}
					/>
					<Button
						onClick={handleSaveCapacity}
						variant='contained'
						disableElevation
						disabled={!capacityChanged}
						sx={{
							bgcolor: '#d4a857',
							color: '#1f1b16',
							fontWeight: 700,
							whiteSpace: 'nowrap',
							'&:hover': { bgcolor: '#c0973f' },
						}}
					>
						儲存
					</Button>
				</Stack>
			</Box>

			<Divider />

			<Box>
				<Typography
					variant='subtitle2'
					sx={{ color: '#7a6a4a', letterSpacing: 1, mb: 1 }}
				>
					設定不可訂位日期
				</Typography>
				<Typography variant='body2' sx={{ color: '#9a8c6c', mb: 2 }}>
					選擇公休日或休假日期，封鎖後客戶將無法選擇此日期訂位。
				</Typography>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={1.5}
					alignItems={{ xs: 'stretch', sm: 'flex-start' }}
				>
					<DatePicker
						value={pickerDate}
						onChange={(v) => v && setPickerDate(v)}
						format='YYYY-MM-DD'
						slotProps={{
							textField: { size: 'medium', fullWidth: true },
						}}
					/>
					<Button
						onClick={handleBlock}
						variant='contained'
						disableElevation
						startIcon={<EventBusyIcon />}
						sx={{
							bgcolor: '#1f1b16',
							color: '#f5e7c4',
							fontWeight: 600,
							whiteSpace: 'nowrap',
							'&:hover': { bgcolor: '#3a3128' },
						}}
					>
						封鎖此日期
					</Button>
				</Stack>
			</Box>

			<Divider />

			<Box>
				<Typography
					variant='subtitle2'
					sx={{ color: '#7a6a4a', letterSpacing: 1, mb: 1 }}
				>
					已封鎖的日期（{blockedDates.length}）
				</Typography>
				{blockedDates.length === 0 ? (
					<Typography variant='body2' sx={{ color: '#9a8c6c' }}>
						目前無封鎖日期
					</Typography>
				) : (
					<Stack direction='row' flexWrap='wrap' gap={1}>
						{blockedDates.map((d) => (
							<Chip
								key={d}
								label={moment(d, 'YYYY-MM-DD')
									.locale('zh-tw')
									.format('YYYY/M/D (dd)')}
								onDelete={() => handleUnblock(d)}
								sx={{
									bgcolor: '#f5e7c4',
									color: '#1f1b16',
									fontWeight: 600,
								}}
							/>
						))}
					</Stack>
				)}
			</Box>
		</Stack>
	);
}

export default function ManageBooking() {
	const [tab, setTab] = useState(0);
	const [bookings, setBookings] = useState([]);
	const [blockedDates, setBlockedDates] = useState([]);
	const [capacity, setCapacityState] = useState({ lunch: 10, dinner: 10 });

	const refresh = () => {
		setBookings(getBookings());
		setBlockedDates(getBlockedDates());
		setCapacityState(getCapacity());
	};

	useEffect(() => {
		refresh();
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='zh-tw'>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					py: { xs: 2, sm: 4 },
					px: { xs: 0.5, sm: 2 },
				}}
			>
				<Paper
					elevation={6}
					sx={{
						width: '100%',
						maxWidth: 720,
						borderRadius: { xs: 2, sm: 3 },
						overflow: 'hidden',
						bgcolor: '#fffdf8',
					}}
				>
					<Box
						sx={{
							bgcolor: '#1f1b16',
							color: '#f5e7c4',
							px: { xs: 3, sm: 4 },
							py: { xs: 2, sm: 3 },
						}}
					>
						<Link
							component={RouterLink}
							to='/booking'
							sx={{
								color: '#d4a857',
								fontSize: 14,
								textDecoration: 'none',
								display: 'inline-flex',
								alignItems: 'center',
								gap: 0.5,
								mb: 1,
								'&:hover': { textDecoration: 'underline' },
							}}
						>
							<ArrowBackIcon fontSize='small' />
							返回訂位
						</Link>
						<Typography
							variant='h4'
							sx={{ fontWeight: 600, letterSpacing: 2 }}
						>
							管理訂位
						</Typography>
					</Box>

					<Tabs
						value={tab}
						onChange={(_, v) => setTab(v)}
						sx={{
							borderBottom: '1px solid #e8dec0',
							'& .MuiTabs-indicator': { backgroundColor: '#d4a857' },
							'& .MuiTab-root': {
								fontWeight: 600,
								color: '#7a6a4a',
								'&.Mui-selected': { color: '#1f1b16' },
							},
						}}
					>
						<Tab label='訂位日曆' />
						<Tab label='管理員設定' />
					</Tabs>

					<Box sx={{ p: { xs: 2, sm: 3 } }}>
						{tab === 0 && (
							<CalendarTab
								bookings={bookings}
								blockedDates={blockedDates}
								capacity={capacity}
								onChanged={refresh}
							/>
						)}
						{tab === 1 && (
							<AdminTab
								blockedDates={blockedDates}
								capacity={capacity}
								onChanged={refresh}
							/>
						)}
					</Box>
				</Paper>
			</Box>
		</LocalizationProvider>
	);
}
