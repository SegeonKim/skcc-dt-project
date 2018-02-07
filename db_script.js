var mongoose = require('mongoose');
var async = require('async');
var db = mongoose.connection;

mongoose.connect('mongodb://segeon:segeon@localhost:27017', function(err) {
    if (err) {
        console.error('mongodb connection error', err);
    }
    console.log('mongodb connected');
});

var phone_db = require('./routes/dbs/phone.js');
var plan_db = require('./routes/dbs/plan.js');

var phone_data = [
    {
        name: 'iPhone X',
        company: 'Apple',
        storage: ['64G', '64G', '256G', '256G'],
        color: ['Space Gray', 'Silver', 'Space Gray', 'Silver'],
        price: ['1360700', '1360700', '1557600', '1557600']
    }
];
var plan_data = [
    {
        name: 'Band 1.2G',
        data: '1.2G',
        call: '집-이동전화 무제한',
        sms: '기본제공',
        month_pay: '39600',
        yakjung: '없음',
        membership: '없음',
        insurance: '없음',
        oksusu: '실시간 채널 무료'
    },
    {
        name: 'Band3.2G',
        data: '3.5G',
        call: '집-이동전화 무제한',
        sms: '기본제공',
        month_pay: '51700',
        yakjung: '없음',
        membership: '없음',
        insurance: '없음',
        oksusu: '실시간 채널 무료'
    },
    {
        name: 'Band 어르신 1.2G',
        data: '1.2G',
        call: '집-이동전화 무제한',
        sms: '기본제공',
        month_pay: '37400',
        yakjung: '없음',
        membership: '없음',
        insurance: '없음',
        oksusu: '없음'
    },
    {
        name: 'Band 데이터 퍼펙트',
        data: '11G',
        call: '집-이동전화 무제한',
        sms: '기본제공',
        month_pay: '65890',
        yakjung: '없음',
        membership: '없음',
        insurance: '없음',
        oksusu: '월정액제 무료'
    },
    {
        name: 'Band 데이터 퍼펙트S',
        data: '16G',
        call: '집-이동전화 무제한',
        sms: '기본제공',
        month_pay: '75900',
        yakjung: '없음',
        membership: '있음',
        insurance: '있음',
        oksusu: '없음'
    },
    {
        name: '뉴 T끼리 맞춤형(100분+250MB)',
        data: '250M',
        call: 'SKT고객간 무제한 + 그외 100분',
        sms: '기본제공',
        month_pay: '27830',
        yakjung: '없음',
        membership: '없음',
        insurance: '없음',
        oksusu: '없음'
    }
];




async.map(phone_data, function(data, next) {
    var new_data = {};
    for (var i in data) {
        new_data[i] = data[i];
    }
    var new_db = new phone_db(new_data);
    new_db.save();
    next();
}, function(err) {
    if (err) {
        console.log('Fail to add phone data', err);
    } else {
        console.log('Complete!!');
    }
});

async.map(plan_data, function(data, next) {
    var new_data = {};
    for (var i in data) {
        new_data[i] = data[i];
    }
    var new_db = new plan_db(new_data);
    new_db.save();
    next();
}, function(err) {
    if (err) {
        console.log('Fail to add phone data', err);
    } else {
        console.log('Complete!!');
    }
});
