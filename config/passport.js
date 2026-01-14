const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// In-memory user store (replace with database in production)
const users = [];

// Hash default admin password on startup
const initializeDefaultUser = async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'sevitech2024';

  const existingUser = users.find(u => u.username === username);
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: 1,
      username: username,
      password: hashedPassword,
      email: 'admin@sevitech.com',
      createdAt: new Date()
    });
  }
};

initializeDefaultUser();

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        // Find user
        const user = users.find(u => u.username === username);

        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
  });
};

// Export users array for password change functionality
module.exports.users = users;
