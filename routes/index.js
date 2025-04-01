var express = require('express');
var router = express.Router();
var db_connection = require('../database/connection');
var bcrypt = require('bcrypt'); // Add bcrypt for password hashing

// GET login page
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Social Circles', error: null});
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query for the user by username
  let sql = 'SELECT * FROM users WHERE username = ?'; // Use 'username' to find the user
  db_connection.query(sql, [username], (err, results) => {
    if (err) throw err;

    // Check if the user exists
    if (results.length > 0) {
      const user = results[0];

      // Check if the password matches the stored hashed password
      bcrypt.compare(password, user.password_hash, (err, match) => {
        if (err) throw err;

        if (match) {
          // Password matches, set session user
          req.session.user = { username: user.username };
          res.redirect('/game'); // Redirect to the game page after successful login
        } else {
          // Password doesn't match, render login with error
          res.render('login', { title: 'Login', error: 'Invalid username or password' });
        }
      });
    } else {
      // If user doesn't exist, render login with error
      res.render('login', { title: 'Login', error: 'Invalid username or password' });
    }
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up', error: null }); // Pass error as null initially
});

router.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return res.render('signup', { title: 'Sign Up', error: 'Passwords do not match' }); // Pass error message
  }

  // Check if username already exists
  db_connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          // If user exists, render the signup page with an error
          return res.render('signup', { title: 'Sign Up', error: 'Username already taken' }); // Pass error message
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into the database
      const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
      db_connection.query(sql, [username, hashedPassword], (err, result) => {
          if (err) throw err;
          res.redirect('/'); // Redirect to login page after successful signup
      });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => { // Destroy the session to log the user out
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.redirect('/'); // Redirect to the login page after logout
  });
});

// GET game page
router.get('/game', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // If user is not logged in, redirect to login
  }

  const sql = 'SELECT * FROM characters';
  db_connection.query(sql, (err, results) => {
    if (err) throw err;

    // Ensure 'started' persists across requests
    if (req.session.started === undefined) {
      req.session.started = false; // Only initialize if undefined
    }

    res.render('game', {
      title: 'Game',
      page: 'game',
      characters: results,
      user: req.session.user,
      started: req.session.started // Use session-based 'started' state
    });
  });
});

// POST start-game
router.post('/start-game', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.session.started = true; // Set the game as started
  res.sendStatus(200); // Respond with success
});

// GET profile page
router.get('/profile', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect if not logged in
  }
  res.render('profile', { title: 'Profile', page: 'profile', username: req.session.user.username });
});

// GET leaderboard page
router.get('/leaderboard', function(req, res, next) {
  res.render('leaderboard', { title: 'Leaderboard', page: 'leaderboard' });
});

// GET characters page
router.get('/characters', function(req, res, next) {
  res.render('characters', { title: 'Characters', page: 'characters' });
});

module.exports = router;