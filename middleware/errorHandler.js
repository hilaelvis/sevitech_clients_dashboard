// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Airtable errors
  if (err.error === 'AUTHENTICATION_REQUIRED') {
    return res.status(401).render('error', {
      title: 'Authentication Error',
      message: 'Invalid Airtable API credentials. Please check your configuration.',
      layout: 'layouts/main'
    });
  }

  if (err.statusCode === 404) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'The requested resource was not found.',
      layout: 'layouts/main'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred. Please try again later.';

  res.status(statusCode).render('error', {
    title: 'Error',
    message: message,
    error: err,
    layout: 'layouts/main'
  });
};

module.exports = errorHandler;
