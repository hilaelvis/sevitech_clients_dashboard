const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('campaign', {
    title: 'Outbound Campaign',
    outboundApiUrl:     process.env.OUTBOUND_API_URL     || 'https://sevitech.site/api/outbound/trigger',
    outboundApiTestUrl: process.env.OUTBOUND_API_TEST_URL || ''
  });
});

module.exports = router;
