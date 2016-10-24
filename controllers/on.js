/**
 * Created by LeonKim on 16. 8. 4..
 */
var request = require('request'),
    moment = require('moment'),
    config = require('../config'),
    STRING = require('../string'),
    DEFINE = STRING.DEFINE;

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
/**
 * @api {get} /on Request to ModuParking from Park
 * @apiName Request to ModuParking
 * @apiGroup On
 *
 * @apiParam {Integer} statusCode 입차:20/출차:30
 * @apiParam {String} carNum 차량번호 (규격화 하지 않음)
 * @apiParam {Date/String} timestamp 시간정보(YYYY-MM-DD HH:mm:ss)
 * @apiParam {Integer} addCharge 초과금 발생 시 초과금액
 *
 * @apiSuccess {Integer} resultCode
 * @apiSuccess {Array} result
 * @apiSuccess {String} message
 *
 * @author leon
 * @date 2016.10.14
 */
exports.getOn = function(req,res){
    var param = req.query;
    console.log(param);
    var vaildParam = {
        statusCode : param.statusCode?param.statusCode:20,
        carNum : param.carNum?param.carNum:'서울11가1111',
        timestamp : param.timestamp?moment(param.timestamp).toJSON():moment().toJSON()
    };
    console.log(vaildParam);
    delete param.statusCode;
    delete param.carNum;
    delete param.timestamp;
    console.log('deleted...')
    if(Object.keys(param).length>0){
        vaildParam.elseParameter = JSON.stringify(param);
    }
    console.log('url : '+config.targetDNS+'parking/'+config.uuid+'/collect');
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
        console.log(body);
        res.send(body)
    });
};


/**
 * @api {post} /on Server -> Park 요청전달
 * @apiName 주차장요청
 * @apiGroup On
 *
 * @apiParam {String} parkinglotSeq 주차장 고유번호
 * @apiSuccess {Html}
 *
 * @author leon
 * @date 2016.10.14 (미완성)
 */
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