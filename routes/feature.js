var user_db = require('./dbs/user.js');
var phone_db = require('./dbs/phone.js');
var plan_db = require('./dbs/plan.js');
var leaving_db = require('./dbs/leaving.js');
var async = require('async');
var recommand_data = require('./recommand_data.js');
var phone_data = {};
var plan_data = {};

var get_dbs = function() {
    async.waterfall([
        function(next) {
            phone_db.find({}, function(err, data) {
                async.map(data, function(phone, cb) {
                    phone_data[phone.name] = phone;
                    cb();
                }, function() {
                    next();
                });
            });
        },
        function(next) {
            plan_db.find({}, function(err, data) {
                async.map(data, function(plan, cb) {
                    plan_data[plan.name] = plan;
                    cb();
                }, function() {
                    next();
                });
            });
        }
    ], function(err) {
        console.log("Finish get DB data!!");
    });
};

get_dbs();

var feature = {};

feature.recommand = function(req, callback) {
    var res = {
        result: false
    };
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

    if (data.images &&  data.images.length > 0) {
        var max = data.images[0].faces[0].age.max;
        var min = data.images[0].faces[0].age.min;
        var age = calc_age(max, min);
        var sex = data.images[0].faces[0].gender.gender.toLowerCase();
        var phone_res = [];
        var plan_res = [];

        var score = parseInt(data.images[0].faces[0].gender.score);
        if (score <= 0.4) {
            sex = sex == 'male' ? 'female' : 'male';
        }

        if (age > 50) age = 50;

        async.waterfall([
            function(next) {
                async.map(recommand_data.phone[sex][age], function(phone, cb) {
                    phone_res[recommand_data.phone[sex][age].indexOf(phone)] = phone_data[phone];
                    cb();
                }, function() {
                    next();
                });
            },
            function(next) {
                async.map(recommand_data.plan[sex][age], function(plan, cb) {
                    plan_res[recommand_data.plan[sex][age].indexOf(plan)] = plan_data[plan];
                    cb();
                }, function() {
                    next();
                });
            }
        ], function() {
            res = {
                result: true,
                data: {
                    age: age,
                    sex: sex,
                    phone: phone_res,
                    plan: plan_res
                }
            }
            console.log("-------[VR] Result-------");
            console.log("Age : " + (min ? min + " ~ " : "") + max);
            console.log("Sex : ", sex);

            callback(res);
        });

    } else {
        res.result = false;
        console.log('Wrong VR Data!');
        callback(res);
    }
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
    var cnt = 0;

    async.map(user_list, function(number, next) {
        user_db.remove({
            phone_number: number
        }, function(err) {
            cnt++;
            next(err);
        });
    }, function(err) {
        if (err) {
            console.log('[Err] Remove user DB : ', err);
            res.result = false;
        }
        var today = new Date();
        leaving_db.findOne({
            month: today.getMonth(),
            date: today.getDate()
        }, function(err, data) {
            if (!data) {
                var new_leaving = new leaving_db({
                    month: today.getMonth(),
                    date: today.getDate(),
                    count: cnt
                });
                new_leaving.save(function() {
                    callback(res);
                });
            } else {
                leaving_db.update({
                    month: today.getMonth(),
                    date: today.getDate()
                }, {
                    $set: {
                        count: data.count + cnt
                    }
                }, function() {
                    callback(res);
                });

            }
        });
    });
};

feature.user.getleaving = function(req, callback) {
    var res = {
        result: false
    };
    var today = new Date();
    leaving_db.findOne({
        month: today.getMonth(),
        date: today.getDate()
    }, function(err, data) {
        if (data) {
            res.result = true;
            res.count = data.count;
        }
        callback(res);
    });
};

feature.user.join = function(req, callback) {
    var res = {};
    var user_data = req.body;
    var new_user = {
        name: user_data.name,
        age: user_data.age,
        sex: user_data.sex,
        phone_number: user_data.phone_number,
        plan: user_data.plan,           // 요금제
        phone: user_data.phone,          // 기종
        remain: user_data.remain,         // 잔여 할부금
        remain_month: user_data.remain_month,   // 잔여 할부 기간
        id_number: user_data.id_number,      // 주민 번호
        address: user_data.address,        // 주소
        account: user_data.account,        // 계좌 번호
        bank: user_data.bank,           // 계좌 은행
        extra_service: user_data.extra_service,   // 부가 서비스
        date: new Date()              // 가입 날짜
    }
    var new_db = new user_db(new_user);
    new_db.save(function(err) {
        if (err) {
            console.log('Fail user join : ', err);
            res.result = false;
        } else {
            console.log('Complete join!!');
            res.result = true;
        }
        callback(res);
    });
};

feature.user.update = function(req, callback) {
    var res = {
        result: false
    };
    var new_data = req.body;

    user_db.update({
        phone_number: new_data.phone_number
    }, {
        $set: new_data
    }, function(err) {
        if (err) {
            console.log('Fail update user DB : ', err);
        } else {
            res.result = true;
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
