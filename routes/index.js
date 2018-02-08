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
        res.json(result);
    });
});

router.get('/get/detail/phone', function(req, res) {
    feature.get_detail_phone(req, function(result) {
        res.json(result);
    });
});

router.get('/get/detail/plan', function(req, res) {
    feature.get_detail_plan(req, function(result) {
        res.json(result);
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

router.post('/user/join', function(req, res) {
    feature.user.join(req, function(result) {
        res.json(result);
    })
});

// router.get('/get/db/phonenplan', function(req, res) {
//     feature.get_db.phone_n_plan(req, function(result) {
//
//     })
// });



module.exports = router;
