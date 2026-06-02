const LocalStrategy = require('passport-local').Strategy;

// Mutable password store — initialized from env vars, can be updated via settings page
// Resets to env var value on cold start (update ADMIN_PASSWORD in Vercel env vars for permanent changes)
let runtimePassword = null;

const getAdminPassword = () => runtimePassword || process.env.ADMIN_PASSWORD || 'sevitech2024';
const setAdminPassword = (password) => { runtimePassword = password; };

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = getAdminPassword();

      if (username !== adminUsername || password !== adminPassword) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, {
        id: 1,
        username: adminUsername,
        email: 'admin@sevitech.com'
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, {
      id: 1,
      username: process.env.ADMIN_USERNAME || 'admin',
      email: 'admin@sevitech.com'
    });
  });
};

module.exports.getAdminPassword = getAdminPassword;
module.exports.setAdminPassword = setAdminPassword;
