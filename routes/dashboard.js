const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const airtableService = require('../services/airtableService');
const { formatRelativeTime } = require('../utils/helpers');

const airtableTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AIRTABLE_TIMEOUT')), 8000)
    )
  ]);

const airtableError = (err, res) => {
  const isBilling = err.message && (
    err.message.includes('BILLING_LIMIT') ||
    err.message.includes('AIRTABLE_TIMEOUT')
  );
  res.status(503).render('error', {
    title: 'Airtable Unavailable',
    message: isBilling
      ? 'Airtable API limit reached for this month. Check your Airtable workspace billing to upgrade or wait for the monthly reset.'
      : 'Could not reach Airtable. Please try again in a moment.',
    error: err
  });
};

// Dashboard home
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const [stats, recentActivity, analytics] = await airtableTimeout(Promise.all([
      airtableService.getDashboardStats(),
      airtableService.getRecentActivity(10),
      airtableService.getAnalytics(30)
    ]));

    res.render('dashboard', {
      title: 'Dashboard',
      stats,
      recentActivity,
      analytics,
      formatRelativeTime
    });
  } catch (error) {
    if (error.message === 'AIRTABLE_TIMEOUT' || error.statusCode === 429) {
      return airtableError(error, res);
    }
    next(error);
  }
});

// API endpoint for dashboard stats (for real-time updates)
router.get('/api/stats', ensureAuthenticated, async (req, res, next) => {
  try {
    const stats = await airtableTimeout(airtableService.getDashboardStats());
    res.json(stats);
  } catch (error) {
    if (error.message === 'AIRTABLE_TIMEOUT' || error.statusCode === 429) {
      return res.status(503).json({ error: 'Airtable unavailable' });
    }
    next(error);
  }
});

module.exports = router;
