var user_db = require('./dbs/user.js');
var phone_db = require('./dbs/phone.js');
var plan_db = require('./dbs/plan.js');
var feature = {};

feature.recommand = function(req, callback) {
    callback({result: true});
};

feature.user = {};

feature.user.get_all = function(req, callback) {
    var res = {
        result: true,
        data: null
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

module.exports = feature;
