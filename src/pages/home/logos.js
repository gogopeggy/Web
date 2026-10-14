// Company marks, extracted from the résumé PDF's own embedded artwork.
//
// Kept out of cvData.js on purpose: that file has to stay pure data so it can
// double as the fallback snapshot AND be read by Node to seed the KV document.
// CV entries therefore reference a logo by key, and the key is resolved here.
//
// A remote CV document may also give `logo` as a full http(s) URL (an R2
// object, say), which lets a new company's logo be added without a deploy.
// See resolveLogo in useCv.js.

import hourLoop from '../../assets/logos/hour-loop.png';
import jumpOrange from '../../assets/logos/jump-orange.png';
import macuTea from '../../assets/logos/macu-tea.png';
import taiwanMobile from '../../assets/logos/taiwan-mobile.png';

const LOGOS = {
	'hour-loop': hourLoop,
	'jump-orange': jumpOrange,
	'macu-tea': macuTea,
	'taiwan-mobile': taiwanMobile,
};

/** A logo is either a key in LOGOS or a full URL (e.g. an R2 object). */
export function resolveLogo(logo) {
	if (typeof logo !== 'string' || !logo) return undefined;
	if (/^https?:\/\//i.test(logo)) return logo;
	return LOGOS[logo];
}

export default LOGOS;
