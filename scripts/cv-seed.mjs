// Prints the CV document to paste into Cloudflare KV. The namespace is titled
// `d1-tutorial-cv-content` in the dashboard (bound as CV_KV in wrangler.toml);
// the key is `cv`.
//
//   node scripts/cv-seed.mjs                       # pretty, for reading
//   node scripts/cv-seed.mjs --min | Set-Clipboard # then paste into KV
//   node scripts/cv-seed.mjs --no-pdf-url          # serve the bundled PDF instead
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

// Included by default: the PDF is in R2, so a document without pdfUrl silently
// downgrades the download button to the bundled copy. This was opt-in while the
// bucket was still empty, which made the plain command emit a document that
// quietly turned R2 off — hence the default now points at R2, and opting out is
// the explicit choice.
if (!process.argv.includes('--no-pdf-url')) {
	doc.pdfUrl = 'https://d1-tutorial.a29098477.workers.dev/api/cv.pdf';
}

const minified = process.argv.includes('--min');
process.stdout.write(JSON.stringify(doc, null, minified ? 0 : '\t') + '\n');
