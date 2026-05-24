const EMAIL_ENDPOINT =
	'https://d1-tutorial.a29098477.workers.dev/api/send-booking-email';

export function sendBookingConfirmation(record) {
	if (!record || !record.email || !record.email.trim()) {
		return Promise.resolve({ skipped: true });
	}

	return fetch(EMAIL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(record),
	})
		.then((res) => res.json().catch(() => ({})))
		.catch((err) => {
			console.warn('booking confirmation email failed:', err);
			return { error: err };
		});
}
