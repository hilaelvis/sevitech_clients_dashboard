// Direct Airtable queries against the base n8n uses (apploh5biPj2FEblj).
// The Vercel app's AIRTABLE_BASE_ID points to a different base — do NOT use
// airtableService.js for campaign/scraper progress tracking.

const N8N_BASE  = 'apploh5biPj2FEblj';
const N8N_TABLE = 'tblLzWnoR5DTM1jBW';

function getPat() {
  return process.env.AIRTABLE_API_KEY || '';
}

function safeStr(v) {
  return String(v || '').replace(/["\\]/g, '');
}

async function countN8nRecords(city, category, status) {
  const pat = getPat();
  const conditions = [];
  if (status)   conditions.push(`{Status}="${safeStr(status)}"`);
  if (city)     conditions.push(`{City}="${safeStr(city)}"`);
  if (category) conditions.push(`{category}="${safeStr(category)}"`);

  const formula = conditions.length === 0 ? ''
    : conditions.length === 1 ? conditions[0]
    : `AND(${conditions.join(',')})`;

  let count = 0;
  let offset = null;

  do {
    const params = new URLSearchParams({ 'fields[]': 'Status', pageSize: '100' });
    if (formula) params.set('filterByFormula', formula);
    if (offset)  params.set('offset', offset);

    const res = await fetch(
      `https://api.airtable.com/v0/${N8N_BASE}/${N8N_TABLE}?${params}`,
      { headers: { Authorization: `Bearer ${pat}` }, signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) throw new Error(`Airtable API ${res.status}`);
    const data = await res.json();
    count += (data.records || []).length;
    offset = data.offset || null;
  } while (offset);

  return count;
}

module.exports = { countN8nRecords };
