var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leavingSchema = new Schema({
    month: Number,
    date: Number,
    count: Number
});

module.exports = mongoose.model('leaving', leavingSchema);
