var mongoose = require('mongoose');
var async = require('async');
var db = mongoose.connection;

mongoose.connect('mongodb://segeon:segeon@localhost:27017', function(err) {
    if (err) {
        console.error('mongodb connection error', err);
    }
    console.log('mongodb connected');
});

var user_db = require('./routes/dbs/user.js');

var user_data = [
    {
        name: '김세건',
        age: 27,
        sex: '남',
        phone_number: '01022799215',
        plan: 'Band 데이터 퍼펙트',
        phone: 'Galaxy S8',
        remain: 220000,
        remain_month: 8,
        id_number: '920215-1234567',
        address: '경기도 용인시 어딘가',
        account: '1002-333-123456',
        bank: '우리',
        extra_service: ['부가1', '부가2'],
        date: new Date()
    },
    {
        name: '정지영',
        age: 27,
        sex: '남',
        phone_number: '01033334444',
        plan: 'Band3.2G',
        phone: 'iPhone 8',
        remain: 530000,
        remain_month: 10,
        id_number: '920101-1234567',
        address: '경기도 성남시 어딘가',
        account: '1002-333-123456',
        bank: '신한',
        extra_service: ['부가1', '부가2', '부가3'],
        date: new Date()
    }
];

async.map(user_data, function(data, next) {
    var new_data = {};
    for (var i in data) {
        new_data[i] = data[i];
    }
    var new_db = new user_db(new_data);
    new_db.save();
    next();
}, function(err) {
    if (err) {
        console.log('Fail to add phone data', err);
    } else {
        console.log('Complete!!');
    }
});
