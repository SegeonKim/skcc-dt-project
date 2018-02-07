var express = require('express');
var router = express.Router();
var feature = require('./feature.js');

router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/main', function(req, res, next) {
  res.render('main.html');
});

router.get('/user', function(req, res, next) {
    res.render('user.html');
});

router.post('/recommand', function(req, res) {
    feature.recommand(req, function(result) {
        res.json(JSON.stringify(result));
    });
});

router.get('/user/getall', function(req, res) {
    feature.user.get_all(req, function(result) {
        res.json(result);
    });
});

router.post('/user/remove', function(req, res) {
    feature.user.remove(req, function(result) {
        res.json(result);
    });
});



module.exports = router;
