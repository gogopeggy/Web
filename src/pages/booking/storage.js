const BOOKINGS_KEY = 'bookings';
const BLOCKED_DATES_KEY = 'blockedDates';
const CAPACITY_KEY = 'bookingCapacity';
const DEFAULT_CAPACITY = { lunch: 10, dinner: 10 };

const serviceOf = (time) => {
	const hour = parseInt(time.split(':')[0], 10);
	return hour < 16 ? 'lunch' : 'dinner';
};

const read = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};

const write = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

const newId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function getBookings() {
	return read(BOOKINGS_KEY, []);
}

export function saveBooking(booking) {
	const list = getBookings();
	const record = { id: newId(), createdAt: new Date().toISOString(), ...booking };
	write(BOOKINGS_KEY, [...list, record]);
	return record;
}

export function updateBooking(id, updates) {
	const list = getBookings().map((b) =>
		b.id === id ? { ...b, ...updates } : b
	);
	write(BOOKINGS_KEY, list);
}

export function deleteBooking(id) {
	write(
		BOOKINGS_KEY,
		getBookings().filter((b) => b.id !== id)
	);
}

export function getBlockedDates() {
	return read(BLOCKED_DATES_KEY, []);
}

export function addBlockedDate(dateStr) {
	const list = getBlockedDates();
	if (list.includes(dateStr)) return;
	write(BLOCKED_DATES_KEY, [...list, dateStr].sort());
}

export function removeBlockedDate(dateStr) {
	write(
		BLOCKED_DATES_KEY,
		getBlockedDates().filter((d) => d !== dateStr)
	);
}

export function getCapacity() {
	return { ...DEFAULT_CAPACITY, ...read(CAPACITY_KEY, {}) };
}

export function setCapacity({ lunch, dinner }) {
	write(CAPACITY_KEY, {
		lunch: Math.max(1, parseInt(lunch, 10) || DEFAULT_CAPACITY.lunch),
		dinner: Math.max(1, parseInt(dinner, 10) || DEFAULT_CAPACITY.dinner),
	});
}

export function computeDayStats(bookings) {
	const map = {};
	for (const b of bookings) {
		if (!map[b.date]) {
			map[b.date] = {
				lunch: { people: 0, groups: 0 },
				dinner: { people: 0, groups: 0 },
			};
		}
		const svc = serviceOf(b.time);
		map[b.date][svc].people += (b.adults || 0) + (b.children || 0);
		map[b.date][svc].groups += 1;
	}
	return map;
}

export function computeFullDates(stats, capacity) {
	return Object.keys(stats).filter(
		(d) =>
			stats[d].lunch.people >= capacity.lunch &&
			stats[d].dinner.people >= capacity.dinner
	);
}

export function clearAllBookings() {
	write(BOOKINGS_KEY, []);
}

const SAMPLE_NAMES = [
	'陳大文', '林小美', '王志強', '李美玲', '張家豪',
	'黃志明', '吳怡君', '劉建宏', '蔡淑芬', '楊明翰',
	'謝美琪', '鄭文豪', '彭家偉', '蘇雅婷', '高士傑',
	'周宛真', '徐建華', '羅佩珊', '簡志偉', '潘思婷',
];

const SAMPLE_PHONES = [
	'0912-345-678', '0922-111-222', '0933-456-789', '0955-987-654',
	'02-2345-6789', '0921-555-111', '0918-333-444', '0987-654-321',
	'0911-222-333', '0966-777-888', '0975-123-456', '0988-654-321',
];

const ALL_SLOTS = [
	'11:00', '11:30', '12:00', '12:30', '13:00',
	'17:00', '17:30', '18:00', '18:30', '19:00',
];

export function seedDummyBookings() {
	const records = [];
	let seq = 0;

	const generateForMonth = (year, month, startDay, endDay) => {
		for (let d = startDay; d <= endDay; d++) {
			const count = (d * 7 + month * 13) % 7;
			const usedSlots = new Set();
			for (let i = 0; i < count; i++) {
				let slotIdx = (d * 11 + i * 23 + month * 31) % ALL_SLOTS.length;
				while (usedSlots.has(slotIdx)) {
					slotIdx = (slotIdx + 1) % ALL_SLOTS.length;
				}
				usedSlots.add(slotIdx);
				const adults = (seq % 4) + 1;
				const children = seq % 5 < 2 ? seq % 5 : 0;
				records.push({
					date: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
					time: ALL_SLOTS[slotIdx],
					adults,
					children,
					name: SAMPLE_NAMES[(seq * 3) % SAMPLE_NAMES.length],
					phone: SAMPLE_PHONES[(seq * 5) % SAMPLE_PHONES.length],
					email: seq % 3 === 0 ? `guest${seq}@example.com` : '',
				});
				seq++;
			}
		}
	};

	generateForMonth(2026, 5, 14, 31);
	generateForMonth(2026, 6, 1, 30);

	const stamped = records.map((r) => ({
		id: newId(),
		createdAt: new Date().toISOString(),
		...r,
	}));
	write(BOOKINGS_KEY, [...getBookings(), ...stamped]);
	return stamped;
}

export function validateBooking(value) {
	const errors = {};
	if (!value.name || !value.name.trim()) errors.name = '請輸入姓名';
	if (!value.phone || !value.phone.trim()) errors.phone = '請輸入聯絡電話';
	else if (!/^[\d\s()+-]{8,}$/.test(value.phone.trim()))
		errors.phone = '電話格式不正確';
	if (value.email && value.email.trim()) {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()))
			errors.email = '電子郵件格式不正確';
	}
	return errors;
}
