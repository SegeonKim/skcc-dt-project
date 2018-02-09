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
    // }
];

var phone_key = {
    1: 'iPhone X',
    2: 'iPhone 8',
    3: 'Galaxy S8',
    4: 'Galaxy A7',
    5: 'X4+',
    6: 'Galaxy A8',
    7: 'V30',
    8: 'XPERIA XZ1',
    9: 'Q6'
};

var plan_key = {
    1: 'Band 1.2G',
    2: 'Band3.2G',
    3: 'Band 어르신 1.2G',
    4: 'Band 데이터 퍼펙트',
    5: 'Band 데이터 퍼펙트S',
    6: '뉴 T끼리 맞춤형(100분+250MB)'
};

var bank_key = ['우리', '신한', '카카오', '기업', '농협']


for (var i = 0; i < 236; i++) {
    var name = 1;
    var age = (parseInt(Math.random() * 100) % 50) + 10;
    var sex = parseInt(Math.random() * 10) % 2 == 0 ? '남' : '여';
    var phone_number = 1000;
    var plan = plan_key[(parseInt(Math.random() * 100) % 6) + 1];
    var phone = phone_key[(parseInt(Math.random() * 100) % 9) + 1];
    var remain = parseInt(Math.random() * 100) * 10000
    var remain_month = parseInt(Math.random() * 100) % 24 + 1;
    var id_number = 1234111;
    var address = 'SK Street ' + name + '번가';
    var account = '1002-333-123456';
    var bank = bank_key[parseInt(Math.random() * 100) % 5];
    var extra_service = ['부가1', '부가2', '컬러링', '데이터안심보험'];
    var date = new Date();
    date.setDate(date.getDate() - (parseInt(Math.random() * 10) % 7));

    var new_data = {
        name: name.toString(),
        age: age,
        sex: sex,
        phone_number: '0101234' + phone_number.toString(),
        plan: plan,
        phone: phone,
        remain: remain,
        remain_month: remain_month,
        id_number: '123456-' + id_number.toString();,
        address: address,
        account: account,
        bank: bank,
        extra_service: extra_service,
        date: date
    }
    name++;
    phone_number++;
    id_number++;
    user_data.push(new_data);
}

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
