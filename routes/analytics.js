const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const airtableService = require('../services/airtableService');

// Analytics page
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const dateRange = parseInt(req.query.range) || 30;
    const analytics = await airtableService.getAnalytics(dateRange);

    res.render('analytics', {
      title: 'Analytics',
      analytics,
      dateRange
    });
  } catch (error) {
    next(error);
  }
});

// API endpoint for analytics data
router.get('/api/data', ensureAuthenticated, async (req, res, next) => {
  try {
    const dateRange = parseInt(req.query.range) || 30;
    const analytics = await airtableService.getAnalytics(dateRange);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
