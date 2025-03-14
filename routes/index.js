var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Social Circles' });
});

router.get('/game', function(req,res) {
  res.render('game',{title: 'Social Circles Game Page'})
})

module.exports = router;
