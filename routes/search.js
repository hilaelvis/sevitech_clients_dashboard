const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const airtableService = require('../services/airtableService');

const WEBHOOK_URL      = process.env.N8N_WEBHOOK_URL;
const WEBHOOK_TEST_URL = process.env.N8N_WEBHOOK_TEST_URL;

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('search', { title: 'Add new Clients' });
});

router.post('/run', ensureAuthenticated, async (req, res) => {
  try {
    const { maps_url, keywords, location, max_results, test_mode, city, category } = req.body;

    if (!maps_url && !keywords) {
      return res.status(400).json({ ok: false, error: 'Provide at least a Maps URL or keywords.' });
    }

    const payload = { max_results: parseInt(max_results) || 50 };
    if (maps_url)           payload.maps_url  = maps_url.trim();
    if (keywords)           payload.keywords  = keywords.trim();
    if (location || city)   payload.location  = (location || city).trim();
    if (city)               payload.city      = city.trim();
    if (category)           payload.category  = category.trim();

    const url = test_mode === 'true' ? WEBHOOK_TEST_URL : WEBHOOK_URL;

    if (!url) {
      return res.status(500).json({ ok: false, error: 'Webhook URL not configured. Set N8N_WEBHOOK_URL in environment variables.' });
    }

    // Snapshot current count before triggering — frontend uses delta to track new records
    let baseline = null;
    try {
      baseline = await airtableService.countClients(city || '', category || '');
    } catch (_) { /* non-fatal */ }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: `Webhook returned ${response.status}` });
    }

    res.json({ ok: true, baseline, city: city || '', category: category || '' });
  } catch (error) {
    console.error('Scraper webhook error:', error);
    res.status(500).json({ ok: false, error: error.message || 'Failed to reach webhook' });
  }
});

router.get('/poll', ensureAuthenticated, async (req, res) => {
  try {
    const { city, category } = req.query;
    const count = await airtableService.countClients(city || '', category || '');
    res.json({ ok: true, count });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
