var express = require('express');
var router = express.Router();
var db_connection = require('../database/connection');
var bcrypt = require('bcrypt'); // Add bcrypt for password hashing
var gameSystem =  require('../private_super_secret_data_that_is_hidden/javascript/gameSystem'); // Import game system
var leaderboard = require('../private_super_secret_data_that_is_hidden/javascript/leaderBoard'); // Import leaderboard system

//sql queries
const GET_PLAYS = 'SELECT plays FROM users WHERE username = ?';
const GET_CHARS = 'SELECT * FROM characters';
const GET_USER_VAL = 'SELECT score, plays FROM users WHERE username = ?'
const GET_USERS = 'SELECT username, score FROM users'
const RESET_PLAYS = 'UPDATE users SET plays = 8'; // Reset plays to 8 for the user
const LEADERBOARD_LEN = 10; // Length of leaderboard

// Initialize game pieces and game
let gamePieces = [];
let game = null;

db_connection.query(GET_CHARS, (err, results) => {
  if (err) throw err;
  let parsed_characters = JSON.parse(JSON.stringify(results));
  parsed_characters.forEach(g => {
    let values = [g.compliment_effect, g.help_effect, g.invite_effect];
    gamePieces.push(new gameSystem.GamePiece(g.name, values));
  }),
  game = new gameSystem.Game(gamePieces);
});

let users = null;
db_connection.query(GET_USERS, (err, results) => {
  if (err) throw err;
  users = new leaderboard.Leaderboard(JSON.parse(JSON.stringify(results)));
});

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
  const { email, username, password, confirmPassword } = req.body;

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
      const sql = 'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)';
      db_connection.query(sql, [email, username, hashedPassword], (err, result) => {
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

  // Ensure 'started' persists across requests
  if (req.session.started === undefined) {
    req.session.started = false; // Only initialize if undefined
  }

  db_connection.query(GET_USER_VAL, req.session.user.username, (err, userScore) => {
    if (err) throw err;
    if (userScore[0].plays <= 0) {
      return res.redirect('/profile'); // Redirect to profile if no plays left
    }
    res.render('game', {
      title: 'Game',
      page: 'game',
      score: userScore[0].score,
      characters: game.getDailies(userScore[0].plays - 1), // Get the current game set
      plays: userScore[0].plays,
      user: req.session.user,
      started: req.session.started // Use session-based 'started' state
    });  
  });
});

// POST game answer
router.post('/answer-game', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect if not logged in
  }
  
  db_connection.query(GET_PLAYS, req.session.user.username, (err, remaining_plays) => {
    if (err) throw err;
    // Check if the user has remaining plays
    if (remaining_plays[0].plays <= 0) {
      return res.redirect('/profile'); // Redirect to game page if no plays left
    }

    const { circle, action } = req.body;
    let newHappy = game.doAction(circle, action, remaining_plays[0].plays - 1);

    let userChange = 'UPDATE users SET score = score + ?, plays = plays - 1 WHERE username = ?';
    db_connection.query(userChange, [newHappy, req.session.user.username], (err, _) => {
        if (err) throw err;
        res.redirect('/game'); // Redirect to login page after successful signup
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
  res.render('leaderboard', { title: 'Leaderboard', page: 'leaderboard', leaderboard: users.getLeaderboard(LEADERBOARD_LEN) });
});

router.post('/leaderboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect if not logged in
  }
  db_connection.query(GET_USERS, (err, result) => {
      if (err) throw err;
      let parsed_users = JSON.parse(JSON.stringify(result));
      users.newList(parsed_users, LEADERBOARD_LEN); 
      res.render('leaderboard', { title: 'Leaderboard', page: 'leaderboard', leaderboard: users.getLeaderboard(LEADERBOARD_LEN) });
  });
});

router.post('/reset-plays', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect if not logged in
  }
  db_connection.query(RESET_PLAYS, (err, result) => {
      if (err) throw err;
      game.resetGame(); // Reset the game state
      res.redirect('/game'); // Redirect to game page after resetting plays
  });
});

// GET characters page
router.get('/characters', function(req, res, next) {
  res.render('characters', { title: 'Characters', page: 'characters' });
});

module.exports = router;