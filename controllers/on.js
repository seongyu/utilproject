/**
 * Created by LeonKim on 16. 8. 4..
 */
var request = require('request'),
    moment = require('moment'),
    config = require('../config');
/*
param : {
    parkinglotSeq : String
    statusCode : Number
    carNum : String
    date : String
  }
 */
exports.getOn = function(req,res){
    var param = req.query;

    var vaildParam = {
        parkinglotSeq : param.parkinglotSeq?param.parkinglotSeq : config.parkinglotSeq,
        statusCode : param.statusCode?param.statusCode:20,
        carNum : param.carNum?param.carNum:'서울11가1111',
        date : param.date?moment(param.date).toJSON():moment().toJSON()
    };

    request({
        url : config.targetDNS+'collect',
        method : 'post',
        qs : vaildParam
    },function(err,response,body){
        if(err){
            res.send(err);
            return;
        }
        console.log(body);
        res.send(body)
    });
};