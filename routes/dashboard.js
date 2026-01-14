const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const airtableService = require('../services/airtableService');
const { formatRelativeTime } = require('../utils/helpers');

// Dashboard home
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const stats = await airtableService.getDashboardStats();
    const recentActivity = await airtableService.getRecentActivity(10);
    const analytics = await airtableService.getAnalytics(30); // Last 30 days

    res.render('dashboard', {
      title: 'Dashboard',
      stats,
      recentActivity,
      analytics,
      formatRelativeTime
    });
  } catch (error) {
    next(error);
  }
});

// API endpoint for dashboard stats (for real-time updates)
router.get('/api/stats', ensureAuthenticated, async (req, res, next) => {
  try {
    const stats = await airtableService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
