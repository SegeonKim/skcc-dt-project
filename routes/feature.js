var user_db = require('./dbs/user.js');
var phone_db = require('./dbs/phone.js');
var plan_db = require('./dbs/plan.js');
var async = require('async');
var recommand_data = require('./recommand_data.js');

var feature = {};

feature.recommand = function(req, callback) {
    var res = {};
    var calc_age = function(max, min) {
        if (!max) {
            min = parseInt(min / 10, 10);
            return min * 10;
        } else if (!min) {
            max = parseInt(max / 10, 10);
            return max * 10;
        }

        max = parseInt(max, 10);
        min = parseInt(min, 10);
        var avg = parseInt(((max + min) / 2) / 10, 10);
        return avg * 10;
    };
    var data = req.body;

    if (data.images) {
        var max = data.images[0].faces[0].age.max;
        var min = data.images[0].faces[0].age.min;
        var age = calc_age(max, min);
        var sex = data.images[0].faces[0].gender.gender.toLowerCase();

        res = {
            result: true,
            data: {
                phone: recommand_data.phone[sex][age],
                plan: recommand_data.plan[sex][age]
            }
        }
        console.log("-------[VR] Result-------");
        console.log("Age : " + (min ? min + " ~ " : "") + max);
        console.log("Sex : ", sex);
    } else {
        res.result = false;
    }
    callback(res);
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

feature.get_detail_phone = function(req, callback) {
    var phone = req.query.name;
    var res = {};

    phone_db.findOne({
        name: phone
    }, function(err, data) {
        if (err || !data) {
            if (err) {
                console.log('[Err] find get phone detail : ', err);
            }
            res.result = false;
        } else {
            res.result = true;
            res.data = data;
        }
        callback(res);
    });
};

feature.get_detail_plan = function(req, callback) {
    var plan = req.query.name;
    var res = {};

    plan_db.findOne({
        name: plan
    }, function(err, data) {
        if (err || !data) {
            if (err) {
                console.log('[Err] find get plan detail : ', err);
            }
            res.result = false;
        } else {
            res.result = true;
            res.data = data;
        }
        callback(res);
    });
};

module.exports = feature;
