const express = require('express');
const passport = require('passport');

require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('./db');
const User = require('./models/User');
const { isAuthenticated } = require('./middleware');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport configuration
require('./passport/passport');

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the main page');
});

app.get('/login', (req, res) => {
  res.send('Login Page');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome to the dashboard, ${req.user.username}!`);
});

// Registration route
app.post(
  '/api/register',
  [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username: username,
        password: hashedPassword,
      });

      // Save the user to the database
      await newUser.save();

      res.json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Registration failed' });
    }
  }
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
