const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

const CAMPAIGN_WEBHOOK_URL = process.env.N8N_CAMPAIGN_WEBHOOK_URL;

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('campaign', { title: 'Outbound Campaign' });
});

router.post('/run', ensureAuthenticated, async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!CAMPAIGN_WEBHOOK_URL) {
      return res.status(500).json({ ok: false, error: 'Campaign webhook URL not configured. Set N8N_CAMPAIGN_WEBHOOK_URL in environment variables.' });
    }

    const payload = { limit: parseInt(limit) || 20 };
    if (category) payload.category = category;

    const response = await fetch(CAMPAIGN_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: `Webhook returned ${response.status}` });
    }

    res.json({ ok: true, limit: payload.limit, category: payload.category || null });
  } catch (error) {
    console.error('Campaign webhook error:', error);
    res.status(500).json({ ok: false, error: error.message || 'Failed to reach webhook' });
  }
});

module.exports = router;
