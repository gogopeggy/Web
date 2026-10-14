import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	certifications,
	education,
	experience,
	languages,
	profile,
	skills,
} from './cvData';

const API = 'https://d1-tutorial.a29098477.workers.dev/api';

/**
 * The copy compiled into the bundle. It renders immediately so the page never
 * shows a spinner or a blank CV, and it is what we fall back to whenever the
 * remote document is missing, unreachable or malformed.
 */
export const BUNDLED_CV = {
	profile,
	experience,
	skills,
	education,
	certifications,
	languages,
};

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isOptionalString = (v) => v === undefined || typeof v === 'string';

/**
 * Validation has to reach the fields the renderer actually dereferences, not
 * just the containers. Checking only `Array.isArray(doc.skills)` lets
 * `[{ label: '前端' }]` through, and `group.items.map` then throws mid-render;
 * with no ErrorBoundary in the tree React unmounts the root and the page goes
 * blank — the exact outcome this guard exists to prevent.
 */
function isValidBullet(bullet) {
	if (!isPlainObject(bullet)) return false;
	if (!isOptionalString(bullet.label)) return false;
	if (!isOptionalString(bullet.short)) return false;
	if (!isOptionalString(bullet.text)) return false;
	if (bullet.children !== undefined) {
		if (!Array.isArray(bullet.children)) return false;
		if (!bullet.children.every(isValidBullet)) return false;
	}
	// Must render as something rather than an empty list item.
	return (
		isNonEmptyString(bullet.text) ||
		isNonEmptyString(bullet.label) ||
		Array.isArray(bullet.children)
	);
}

// Keyed by the field each renderer in Home.js dereferences.
const SECTION_ITEM_VALIDATORS = {
	skills: (g) =>
		isPlainObject(g) &&
		isNonEmptyString(g.label) &&
		Array.isArray(g.items) &&
		g.items.every((item) => typeof item === 'string'),
	education: (e) =>
		isPlainObject(e) &&
		isNonEmptyString(e.school) &&
		isNonEmptyString(e.period) &&
		isOptionalString(e.schoolEn) &&
		isOptionalString(e.detail),
	certifications: (c) => isPlainObject(c) && isNonEmptyString(c.name) && isOptionalString(c.issuer),
	languages: (l) => isPlainObject(l) && isNonEmptyString(l.name) && isOptionalString(l.level),
};

/**
 * Guards against a half-edited KV document blanking the page. Anything that
 * fails here is discarded in favour of the bundled copy, so a typo in the
 * Cloudflare dashboard costs nothing worse than a stale CV.
 */
function isValidCv(doc) {
	if (!isPlainObject(doc)) return false;

	if ('profile' in doc) {
		if (!isPlainObject(doc.profile)) return false;
		if (!isNonEmptyString(doc.profile.name)) return false;
		for (const key of ['nameEn', 'initial', 'title', 'email', 'summary']) {
			if (!isOptionalString(doc.profile[key])) return false;
		}
	}

	// `pdfUrl` ends up in an anchor href, so restrict it to http(s). Without
	// this a `javascript:` value would execute on click, and a non-string would
	// render as "[object Object]" and a dead download button.
	if ('pdfUrl' in doc && !/^https?:\/\//i.test(String(doc.pdfUrl))) return false;

	// A document that omits `experience` entirely is allowed — the bundled
	// list is kept. One that includes it must be a usable list.
	if ('experience' in doc) {
		if (!Array.isArray(doc.experience) || doc.experience.length === 0) return false;
		const everyEntryUsable = doc.experience.every(
			(entry) =>
				isPlainObject(entry) &&
				isNonEmptyString(entry.company) &&
				isNonEmptyString(entry.role) &&
				isNonEmptyString(entry.period) &&
				isOptionalString(entry.companyNote) &&
				isOptionalString(entry.logo) &&
				isOptionalString(entry.intro) &&
				Array.isArray(entry.bullets) &&
				entry.bullets.every(isValidBullet)
		);
		if (!everyEntryUsable) return false;
	}

	for (const [key, isValidItem] of Object.entries(SECTION_ITEM_VALIDATORS)) {
		if (!(key in doc)) continue;
		if (!Array.isArray(doc[key]) || !doc[key].every(isValidItem)) return false;
	}

	return true;
}

/**
 * Merges a validated remote document over the bundled one.
 *
 * `profile` is merged per-key rather than replaced: validation only requires
 * `name`, so a remote profile editing just the summary would otherwise drop
 * `initial`, `title` and `email` — rendering an empty avatar and a contact
 * button reading `mailto:undefined`. Arrays (experience, skills, …) are
 * replaced wholesale, because there is no meaningful way to merge a list.
 */
function mergeCv(remote) {
	const merged = { ...BUNDLED_CV, ...remote };
	if (remote.profile) {
		merged.profile = { ...BUNDLED_CV.profile, ...remote.profile };
	}
	return merged;
}

/**
 * Returns the CV document: the bundled copy first, replaced by the one stored
 * in Cloudflare KV once it arrives and passes validation. Top-level keys absent
 * from the remote document keep their bundled values, so a partial edit is safe.
 */
export default function useCv() {
	const [cv, setCv] = useState(BUNDLED_CV);

	useEffect(() => {
		const controller = new AbortController();

		axios
			.get(`${API}/cv`, { signal: controller.signal })
			.then((response) => {
				if (!isValidCv(response.data)) {
					throw new Error('remote CV document failed validation');
				}
				setCv(mergeCv(response.data));
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				// Not a user-facing failure: the bundled CV is already rendered.
				console.warn('[cv] using bundled copy —', error.message);
			});

		return () => controller.abort();
	}, []);

	return cv;
}
