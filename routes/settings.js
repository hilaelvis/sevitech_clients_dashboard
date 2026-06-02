const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { passwordChangeValidation, validate } = require('../utils/validators');
const { getAdminPassword, setAdminPassword } = require('../config/passport');

// Settings page
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('settings', {
    title: 'Settings'
  });
});

// Change password
router.post('/password', ensureAuthenticated, passwordChangeValidation, validate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (currentPassword !== getAdminPassword()) {
      req.flash('error_msg', 'Current password is incorrect');
      return res.redirect('/settings');
    }

    setAdminPassword(newPassword);

    req.flash('success_msg', 'Password changed successfully. To make it permanent, update ADMIN_PASSWORD in your Vercel environment variables.');
    res.redirect('/settings');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
