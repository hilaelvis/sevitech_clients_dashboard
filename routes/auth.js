const express = require('express');
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { loginValidation, validate } = require('../utils/validators');

// Login page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', {
    title: 'Login',
    layout: false,
    messages: {
      error_msg: req.flash('error_msg'),
      error: req.flash('error'),
      success_msg: req.flash('success_msg')
    }
  });
});

// Login handler
router.post('/login',
  authLimiter,
  loginValidation,
  validate,
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

// Logout handler
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.flash('success_msg', 'You have been logged out successfully');
    res.redirect('/auth/login');
  });
});

module.exports = router;
