var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var phoneSchema = new Schema({
    name: String,
    company: String,
    storage: String,
    color: String,
    price: String
});

module.exports = mongoose.model('phone', phoneSchema);
