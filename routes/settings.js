const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../middleware/auth');
const { passwordChangeValidation, validate } = require('../utils/validators');
const { users } = require('../config/passport');

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
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/settings');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      req.flash('error_msg', 'Current password is incorrect');
      return res.redirect('/settings');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    req.flash('success_msg', 'Password changed successfully');
    res.redirect('/settings');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
