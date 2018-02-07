var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_id: Number,
    name: String,
    age: Number,
    sex: String,
    phone_number: String,
    plan: String,       // 요금제
    phone: String,      // 기종
    remain: Number,     // 잔여 할부금
    remain_month: Number, // 잔여 할부 기간
    id_number: String,  // 주민 번호
    address: String,    // 주소
    account: String,    // 계좌 번호
    extra_service: Array,     // 부가 서비스
    date: Date          // 가입 날짜


});

module.exports = mongoose.model('user', userSchema);
