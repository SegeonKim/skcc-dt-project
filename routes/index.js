var express = require('express');
var router = express.Router();
var feature = require('./feature.js');

var admin_id = 'admin';
var admin_password = 'skcc';

var check_session = function(req, res, next) {
  var session = req.session;
  var url = new Buffer(req.protocol + '://' + req.get('host') + req.originalUrl).toString('base64');

  if (session.user_data) {
    next();
  } else {
    res.redirect('/login?q=' + url);
  }
};

// router.get('/', function(req, res, next) {
//   res.render('index.html');
// });

router.get('/', function(req, res, next) {
  res.render('main.html');
});

router.get('/main', function(req, res, next) {
  res.render('main.html');
});

router.get('/login', function(req, res) {
    res.render('login.html');
});

router.post('/signin', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;

    var result = {
        result: false
    };

    if (id == admin_id && password == admin_password) {
        req.session.user_data = {
            id: admin_id
        }
        result.result = true;
    }
    res.json(result);
});

router.post('/signout', check_session, function(req, res) {
  req.session.destroy(function() {
      res.json({});
  });
});

router.get('/user', check_session, function(req, res, next) {
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
        if (req.session.user_data) {
            result.session = true;
        }
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

router.post('/user/update', function(req, res) {
    feature.user.update(req, function(result) {
        res.json(result);
    });
});

router.get('/user/getleaving', function(req, res) {
    feature.user.getleaving(req, function(result) {
        res.json(result);
    });
});

// router.get('/get/db/phonenplan', function(req, res) {
//     feature.get_db.phone_n_plan(req, function(result) {
//
//     })
// });



module.exports = router;
