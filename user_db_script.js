var mongoose = require('mongoose');
var async = require('async');
var db = mongoose.connection;

mongoose.connect('mongodb://segeon:segeon@localhost:27017/dt', function(err) {
    if (err) {
        console.error('mongodb connection error', err);
    }
    console.log('mongodb connected');
    script();
});

var user_db = require('./routes/dbs/user.js');

var now = new Date();
now.setDate(now.getDate()-1);

var user_data = [
    // {
    //     name: '김세건',
    //     age: 27,
    //     sex: '남',
    //     phone_number: '01022799215',
    //     plan: 'Band 데이터 퍼펙트',
    //     phone: 'Galaxy S8',
    //     remain: 220000,
    //     remain_month: 8,
    //     id_number: '920215-1234567',
    //     address: '경기도 용인시 어딘가',
    //     account: '1002-333-123456',
    //     bank: '우리',
    //     extra_service: ['부가1', '부가2'],
    //     date: new Date()
    // },
    // {
    //     name: '정지영',
    //     age: 27,
    //     sex: '남',
    //     phone_number: '01033334444',
    //     plan: 'Band3.2G',
    //     phone: 'iPhone 8',
    //     remain: 530000,
    //     remain_month: 10,
    //     id_number: '920101-1234567',
    //     address: '경기도 성남시 어딘가',
    //     account: '1002-333-123456',
    //     bank: '신한',
    //     extra_service: ['부가1', '부가2', '부가3'],
    //     date: new Date()
    // },
    // {
    //     name: '오예진',
    //     age: 26,
    //     sex: '여',
    //     phone_number: '01055556666',
    //     plan: 'Band 어르신 1.2G',
    //     phone: 'Galaxy A7',
    //     remain: 150000,
    //     remain_month: 2,
    //     id_number: '930101-1234567',
    //     address: '경기도 안양시 어딘가',
    //     account: '1002-333-123456',
    //     bank: '기업',
    //     extra_service: ['부가설뷔스1'],
    //     date: new Date()
    // },
    // {
    //     name: '이주하',
    //     age: 24,
    //     sex: '여',
    //     phone_number: '01077778888',
    //     plan: '뉴 T끼리 맞춤형(100분+250MB)',
    //     phone: 'Q6',
    //     remain: 150000,
    //     remain_month: 2,
    //     id_number: '930101-1234567',
    //     address: '경기도 안양시 어딘가',
    //     account: '1002-333-123456',
    //     bank: '카카오',
    //     extra_service: ['부가설뷔스1', '부부부부부부부부부부가~'],
    //     date: new Date()
    // }
    {
        name: '신승관',
        age: 17,
        sex: '남',
        phone_number: '01021234355',
        plan: 'Band 데이터 퍼펙트',
        phone: 'Galaxy S8',
        remain: 240000,
        remain_month: 8,
        id_number: '200211-1234567',
        address: '경기도 용인시 어딘가',
        account: '1002-333-123456',
        bank: '우리',
        extra_service: ['부가1', '부가2'],
        date: now
    },
    {
        name: '윤성준',
        age: 34,
        sex: '남',
        phone_number: '01022114455',
        plan: 'Band3.2G',
        phone: 'XPERIA XZ1',
        remain: 530000,
        remain_month: 10,
        id_number: '920101-1433434',
        address: '경기도 성남시 어딘가',
        account: '1002-333-123456',
        bank: '신한',
        extra_service: ['부가1', '부가2', '부가3'],
        date: now
    },
    {
        name: '사나',
        age: 19,
        sex: '여',
        phone_number: '01012345555',
        plan: 'Band 어르신 1.2G',
        phone: 'Galaxy A7',
        remain: 150000,
        remain_month: 2,
        id_number: '010101-1234567',
        address: '경기도 안양시 어딘가',
        account: '1002-333-123456',
        bank: '기업',
        extra_service: ['부가설뷔스1'],
        date: now
    }
];

var script = function() {
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
};
