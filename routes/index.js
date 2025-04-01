var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var db_connection = require('../database/connection');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Social Circles', error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db_connection.query(sql, [username], async (err, results) => {  // Use db_connection here
      if (err) throw err;

      if (results.length > 0) {
          const user = results[0];

          // Compare hashed password
          const passwordMatch = await bcrypt.compare(password, user.password_hash);
          if (passwordMatch) {
              req.session.user = { id: user.user_id, username: user.username };
              res.redirect('/game'); // Redirect to game page
          } else {
              res.render('login', { title: 'Social Circles', error: 'Invalid username or password' });
          }
      } else {
          res.render('login', { title: 'Social Circles', error: 'Invalid username or password' });
      }
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { error: null });
});

router.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return res.render('signup', { title: 'Sign Up', error: 'Passwords do not match' });
  }

  // Check if username already exists
  db_connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          // If user exists, render the signup page with an error
          return res.render('signup', { title: 'Sign Up', error: 'Username already taken' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into the database
      const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
      db_connection.query(sql, [username, hashedPassword], (err, result) => {
          if (err) throw err;
          res.redirect('/');
      });
  });
});

router.get('/game', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/');
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

router.post('/start-game', (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' }); // Prevent unauthorized access
  }

  req.session.started = true; // Set the game as started
  res.sendStatus(200); // Respond with success
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: ' Profile', page: 'profile', username: req.session.user.username});
});

router.get('/leaderboard', function(req, res, next) {
  res.render('leaderboard', { title: 'Leaderboard', page: 'leaderboard'});
});

router.get('/characters', function(req, res, next) {
  res.render('characters', { title: 'Characters', page: 'characters'});
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/game');
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
  });
});

module.exports = router;
