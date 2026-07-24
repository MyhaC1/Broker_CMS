/**
 * Контрактный тест: ответы живой CMS сравниваются с эталонными фикстурами
 * platform-contracts (contract/fixtures) по всем 14 ресурсам × ru/en,
 * плюс деталка статьи, auth и 404. Datetime-поля сравниваются по моменту
 * времени (CMS отдаёт канонический ISO с миллисекундами).
 *
 * Запуск: node scripts/contract-check.mjs   (нужны env CMS_URL?, CMS_API_KEY?)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert';

const CMS = (process.env.CMS_URL ?? 'http://localhost:3001').replace(/\/$/, '');
const KEY = process.env.CMS_API_KEY ?? 'dev-cms-api-key';
const FIXTURES = join(process.cwd(), 'contract', 'fixtures');

const RESOURCES = [
  'brand', 'navigation', 'faq', 'instruments', 'accounts', 'promotions',
  'partners', 'academy', 'streams', 'articles', 'contacts', 'careers',
  'legal', 'system-status',
];

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
function normalize(value) {
  if (typeof value === 'string' && ISO_RE.test(value)) return new Date(value).toISOString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v)]));
  return value;
}

let failures = 0;
const fail = (msg) => { failures++; console.log(`FAIL  ${msg}`); };

for (const resource of RESOURCES) {
  for (const locale of ['ru', 'en']) {
    const res = await fetch(`${CMS}/v1/cms/${resource}?locale=${locale}`, {
      headers: { 'X-API-Key': KEY },
    });
    if (!res.ok) { fail(`${resource} ${locale}: HTTP ${res.status}`); continue; }
    const body = await res.json();
    const fixture = JSON.parse(readFileSync(join(FIXTURES, `cms.${resource}.${locale}.json`), 'utf8'));
    // Медиа в seed не загружаются — фикстурный favicon сайта заменяем на null
    if (resource === 'brand') fixture.favicon = null;
    try {
      assert.deepStrictEqual(normalize(body), normalize(fixture));
      console.log(`OK    ${resource} ${locale}`);
    } catch {
      const got = JSON.stringify(normalize(body));
      const exp = JSON.stringify(normalize(fixture));
      let i = 0;
      while (i < Math.min(got.length, exp.length) && got[i] === exp[i]) i++;
      fail(`${resource} ${locale}: расхождение @${i}\n  got:      …${got.slice(Math.max(0, i - 40), i + 160)}\n  expected: …${exp.slice(Math.max(0, i - 40), i + 160)}`);
    }
  }
}

const detail = await fetch(`${CMS}/v1/cms/articles/gold-tests-record-highs?locale=en`, { headers: { 'X-API-Key': KEY } });
const detailBody = detail.ok ? await detail.json() : null;
if (detailBody?.slug === 'gold-tests-record-highs') console.log('OK    article detail');
else fail(`article detail: HTTP ${detail.status}`);

const missing = await fetch(`${CMS}/v1/cms/articles/no-such-slug?locale=ru`, { headers: { 'X-API-Key': KEY } });
missing.status === 404 ? console.log('OK    article 404') : fail(`article 404 -> ${missing.status}`);

const noKey = await fetch(`${CMS}/v1/cms/brand?locale=ru`);
noKey.status === 401 ? console.log('OK    auth 401') : fail(`auth -> ${noKey.status}`);

const unknown = await fetch(`${CMS}/v1/cms/nope?locale=ru`, { headers: { 'X-API-Key': KEY } });
unknown.status === 404 ? console.log('OK    unknown 404') : fail(`unknown -> ${unknown.status}`);

console.log(failures ? `\n${failures} FAILURES` : '\nALL OK');
process.exit(failures ? 1 : 0);
