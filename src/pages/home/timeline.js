// Geometry for the experience timeline.
//
// The rail is drawn by Home.js and the dots by ExperienceCard.js, against two
// different containing blocks: the rail is positioned inside the timeline
// wrapper, each dot inside its own card. Hand-tuning the two sets of numbers
// separately is what let them drift out of alignment, so both are derived
// from the values below. Change these, not the call sites.

/** Left padding of the timeline wrapper — the gap the rail lives in. */
export const TIMELINE_PAD = { xs: 22, sm: 30 };

/** Rail position and thickness, within the timeline wrapper. */
export const RAIL_LEFT = 5;
export const RAIL_WIDTH = 2;

/** Dot diameter (border-box: `* { box-sizing: border-box }` in index.css). */
export const DOT_SIZE = 12;

// Centre of the rail, measured from the timeline wrapper's left edge.
const RAIL_CENTER = RAIL_LEFT + RAIL_WIDTH / 2;

/**
 * Dot offset relative to its card. Cards start at TIMELINE_PAD, so subtract
 * that to get back to the wrapper's coordinate space, then pull left by half
 * the dot so its centre lands on the rail's centre.
 */
export const DOT_LEFT = {
	xs: `${RAIL_CENTER - DOT_SIZE / 2 - TIMELINE_PAD.xs}px`,
	sm: `${RAIL_CENTER - DOT_SIZE / 2 - TIMELINE_PAD.sm}px`,
};

/** Vertical centre of the card header's first text line. */
export const DOT_TOP = '21px';
