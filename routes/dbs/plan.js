var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var planSchema = new Schema({
    name: String,
    data: String,
    call: String,
    sms: String,
    month_pay: String,
    yakjung: String,
    membership: String,
    insurance: String,
    oksusu: String
});

module.exports = mongoose.model('plan', planSchema);
