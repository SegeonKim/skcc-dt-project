var user_db = require('./dbs/user.js');
var phone_db = require('./dbs/phone.js');
var plan_db = require('./dbs/plan.js');
var async = require('async');

var feature = {};

feature.recommand = function(req, callback) {
    callback({result: true});
};

feature.user = {};

feature.user.get_all = function(req, callback) {
    var res = {
        result: true,
        data: []
    };
    user_db.find({}, function(err, data) {
        if (err) {
            console.log("[Err] Get all user data : ", err);
            res.result = false;
        } else {
            res.data = data;
        }
        callback(res);
    });
};

feature.user.remove = function(req, callback) {
    var user_list = req.body.users;
    var res = {
        result: true
    };

    async.map(user_list, function(number, next) {
        user_db.remove({
            phone_number: number
        }, function(err) {
            next(err);
        });
    }, function(err) {
        if (err) {
            console.log('[Err] Remove user DB : ', err);
            res.result = false;
        }
        callback(res);
    });
};

module.exports = feature;
