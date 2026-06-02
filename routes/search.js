const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

const WEBHOOK_URL      = process.env.N8N_WEBHOOK_URL      || 'https://sevitech.site/n8n/webhook/sevitech-scraper';
const WEBHOOK_TEST_URL = process.env.N8N_WEBHOOK_TEST_URL || 'https://sevitech.site/n8n/webhook-test/sevitech-scraper';

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('search', { title: 'Client Search' });
});

router.post('/run', ensureAuthenticated, async (req, res) => {
  try {
    const { maps_url, keywords, location, max_results, test_mode } = req.body;

    if (!maps_url && !keywords) {
      return res.status(400).json({ ok: false, error: 'Provide at least a Maps URL or keywords.' });
    }

    const payload = { max_results: parseInt(max_results) || 50 };
    if (maps_url) payload.maps_url = maps_url.trim();
    if (keywords) payload.keywords = keywords.trim();
    if (location) payload.location = location.trim();

    const url = test_mode === 'true' ? WEBHOOK_TEST_URL : WEBHOOK_URL;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: `Webhook returned ${response.status}` });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Scraper webhook error:', error);
    res.status(500).json({ ok: false, error: error.message || 'Failed to reach webhook' });
  }
});

module.exports = router;
