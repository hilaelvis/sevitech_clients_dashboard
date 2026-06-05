const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

const OUTBOUND_API_URL      = process.env.OUTBOUND_API_URL      || 'https://sevitech.site/api/outbound/trigger';
const OUTBOUND_API_TEST_URL = process.env.OUTBOUND_API_TEST_URL || '';
const OUTBOUND_API_TOKEN    = process.env.OUTBOUND_API_TOKEN;

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('campaign', { title: 'Outbound Campaign' });
});

router.post('/run', ensureAuthenticated, async (req, res) => {
  try {
    if (!OUTBOUND_API_TOKEN) {
      return res.status(500).json({ ok: false, error: 'OUTBOUND_API_TOKEN not set in environment variables.' });
    }

    const { category, city, limit, message, test_mode } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ ok: false, error: 'Message cannot be empty.' });
    }

    const url = (test_mode === 'true' && OUTBOUND_API_TEST_URL) ? OUTBOUND_API_TEST_URL : OUTBOUND_API_URL;

    const payload = {
      limit:    parseInt(limit) || 20,
      category: category || '',
      city:     city || '',
      message:  message.trim()
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${OUTBOUND_API_TOKEN}`
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({ ok: false, error: `API returned ${response.status}${text ? ': ' + text : ''}` });
    }

    res.json({ ok: true, limit: payload.limit, category: payload.category });
  } catch (error) {
    console.error('Campaign API error:', error);
    res.status(500).json({ ok: false, error: error.message || 'Failed to reach API' });
  }
});

module.exports = router;
