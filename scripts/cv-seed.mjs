// Prints the CV document to paste into Cloudflare KV. The namespace is titled
// `d1-tutorial-cv-content` in the dashboard (bound as CV_KV in wrangler.toml);
// the key is `cv`.
//
//   node scripts/cv-seed.mjs                       # pretty, for reading
//   node scripts/cv-seed.mjs --min | Set-Clipboard # then paste into KV
//   node scripts/cv-seed.mjs --bundled-assets      # omit the R2 PDF/photo URLs
//
// Do NOT capture it with PowerShell's `>` or `Out-File -Encoding utf8`:
// Windows PowerShell writes a UTF-8 BOM, and a BOM makes the stored value
// fail JSON.parse. Pipe to the clipboard, or use
// `[IO.File]::WriteAllText($p, (node scripts/cv-seed.mjs --min))`.
//
// This reads src/pages/home/cvData.js directly, which is why that file must
// stay free of imports — Node cannot load the PNG imports a bundler handles.

import { pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const dataUrl = pathToFileURL(path.join(here, '..', 'src', 'pages', 'home', 'cvData.js')).href;

const { profile, experience, skills, education, certifications, languages } = await import(dataUrl);

const doc = {
	profile,
	experience,
	skills,
	education,
	certifications,
	languages,
};

// Point at R2 by default. Omitting these silently downgrades the page to the
// copies compiled into the bundle, which looks identical today and would only
// show up later as "I replaced the file in R2 and nothing changed". That bug
// already happened once while these were opt-in, so opting *out* is now the
// explicit choice.
// `profile.photo` already carries its R2 URL from cvData.js, so only the PDF
// needs adding here; --bundled-assets drops both.
if (process.argv.includes('--bundled-assets')) {
	const { photo, ...withoutPhoto } = doc.profile;
	doc.profile = withoutPhoto;
} else {
	doc.pdfUrl = 'https://d1-tutorial.a29098477.workers.dev/api/cv.pdf';
}

const minified = process.argv.includes('--min');
process.stdout.write(JSON.stringify(doc, null, minified ? 0 : '\t') + '\n');
