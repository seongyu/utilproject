'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');


var LogSchema = Schema({
    seq : Number,
    parkinglotSeq : String,
    carNum : String,
    statusCode : Number,
    message : String,
    resDate : { type: Date, default: Date.now }
});

autoIncrement.initialize(mongoose.connection);
LogSchema.plugin(autoIncrement.plugin, {
    model : 'Log',
    field : 'seq',
    startAt : 1,
    incrementBy : 1
});
exports.logger = mongoose.model('Log',LogSchema);

