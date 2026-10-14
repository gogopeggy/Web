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

/**
 * Guards against a half-edited KV document blanking the page. Anything that
 * fails here is discarded in favour of the bundled copy, so a typo in the
 * Cloudflare dashboard costs nothing worse than a stale CV.
 */
function isValidCv(doc) {
	if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return false;

	if ('profile' in doc) {
		if (!doc.profile || typeof doc.profile !== 'object') return false;
		if (!isNonEmptyString(doc.profile.name)) return false;
	}

	// A document that omits `experience` entirely is allowed — the bundled
	// list is kept. One that includes it must be a usable list.
	if ('experience' in doc) {
		if (!Array.isArray(doc.experience) || doc.experience.length === 0) return false;
		const everyEntryUsable = doc.experience.every(
			(entry) =>
				entry &&
				typeof entry === 'object' &&
				isNonEmptyString(entry.company) &&
				isNonEmptyString(entry.role) &&
				isNonEmptyString(entry.period) &&
				Array.isArray(entry.bullets)
		);
		if (!everyEntryUsable) return false;
	}

	for (const key of ['skills', 'education', 'certifications', 'languages']) {
		if (key in doc && !Array.isArray(doc[key])) return false;
	}

	return true;
}

/**
 * Returns the CV document: the bundled copy first, replaced by the one stored
 * in Cloudflare KV once it arrives and passes validation. Keys absent from the
 * remote document keep their bundled values, so a partial edit is safe.
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
				setCv({ ...BUNDLED_CV, ...response.data });
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
