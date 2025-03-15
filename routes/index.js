var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Social Circles' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  //const user = users.find(u => u.username === username && u.password === password);
  res.render("game", { title: 'Social Circles Game Page', page: 'game'});
  //if (user) {
     //req.session.user = { username }; // Store in session
     //res.redirect('/game'); // Redirect to game page
  //} else {
      //res.render("login", { error: "Invalid username or password" });
  //}
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Social Circles' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Social Circles Game Page', page: 'game'});
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Player Profile', page: 'profile'/*, username: req.session.user.username*/});
});

router.get('/leaderboard', function(req, res, next) {
  res.render('leaderboard', { title: 'Leaderboard', page: 'leaderboard'});
});

router.get('/characters', function(req, res, next) {
  res.render('characters', { title: 'Characters', page: 'characters'});
});


module.exports = router;
