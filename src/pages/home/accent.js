// The CV page's accent colour, in one place.
//
// Deliberately NOT the theme's `secondary.main` (#2563eb) — that brighter blue
// is still used by the other dashboard pages, so overriding it in the theme
// would change them too. Home owns this one.
//
// Change ACCENT and the two derived values together: ACCENT_RING is ACCENT at
// 14% alpha, and ACCENT_SOFT is the low-contrast tint used for pills and
// chips. ACCENT_SOFT.color is darkened from ACCENT so it clears 4.5:1 against
// its own background (it sits at 5.7:1; plain ACCENT would only reach 4.2:1).

export const ACCENT = '#4073c5';

export const ACCENT_RING = 'rgba(64,115,197,.14)';

export const ACCENT_SOFT = {
	color: '#35609f',
	bgcolor: '#eef3fb',
	border: '1px solid',
	borderColor: '#c6d8f1',
};
