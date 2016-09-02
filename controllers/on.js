/**
 * Created by LeonKim on 16. 8. 4..
 */
var request = require('request'),
    moment = require('moment'),
    config = require('../config');

/*
  param : {
    statusCode : Number   20 => in , 30 => out
    carNum : String ====> 차량번호 규격화 하지 않음
    timestamp : String

    deviceID => ::: UUID ::: => 가상의 uuid 획득
    sample => https://iot.moduapi.com/parking/uuid/....

    uuid 생성용 코드 작성
     => 처음 서버 실행 시 생성, 만약 없으면 생성, 있으면 있는거 사용
     ==> 파일로 적어놓는 걸로...
  }
*/

exports.getOn = function(req,res){
    var param = req.query;

    var vaildParam = {
        statusCode : param.statusCode?param.statusCode:20,
        carNum : param.carNum?param.carNum:'서울11가1111',
        timestamp : param.timestamp?moment(param.timestamp).toJSON():moment().toJSON()
    };

    delete param.statusCode;
    delete param.carNum;
    delete param.timestamp;

    if(Object.keys(param).length>0){
        vaildParam.message = JSON.stringify(param);
    }

    request({
        url : config.targetDNS+'parking/'+config.uuid+'/collect',
        method : 'post',
        qs : vaildParam //send as getParameter
        // form : {} //send as postParameter
    },function(err,response,body){
        if(err){
            console.log('Error...=> '+err);
            res.send(err);
            return;
        }
        res.send(body)
    });
};

exports.postOn = function(req,res){
    var param = req.body;

    console.log('Send Acting to Device-----');
    console.log('.');
    console.log('.');
    console.log('.');
    console.log('.');
    console.log('-----get Result of Action.');

    res.send({
        resultCode : param.resultCode, //resultCode Of Acton
        message : param.message        //detail of Action
    });
};