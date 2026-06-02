require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');

// Import configurations
require('./config/passport')(passport);

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const clientsRoutes = require('./routes/clients');
const messagesRoutes = require('./routes/messages');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Vercel's reverse proxy so req.secure, req.ip, and secure cookies work correctly
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup
const ejs = require('ejs');
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Disable view caching in development
if (process.env.NODE_ENV !== 'production') {
  app.set('view cache', false);
  ejs.clearCache();
}

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration — cookie-session stores session data client-side (stateless, works in serverless)
app.use(cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  maxAge: 365 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax'
}));

// Passport 0.6+ compatibility shim for cookie-session (adds missing save/regenerate methods)
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => cb();
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => cb();
  }
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/clients', clientsRoutes);
app.use('/messages', messagesRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.',
    layout: 'layouts/main'
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
