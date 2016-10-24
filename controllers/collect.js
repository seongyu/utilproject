/**
 * Created by LeonKim on 16. 8. 5..
 */
var collect_model = require('../models/collect'),
    public_model = require('../models/public'),
    promise = require('q'),
    MongoLog = require('../models/log'),
    STRING = require('../string'),
    DEFINE = STRING.DEFINE;

/*
 parkinglotSeq
 carNum
 statusCode
 그 이외 json.stringify
 */
/**
 * @api {post} /collect 디바이스에서 전달된 정보 수집
 * @apiName 디바이스요청컬렉팅
 * @apiGroup Collect
 *
 * @apiParam {String} uuid url-param으로 제공받음
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

exports.postCollect = function(req,res){
    var param = req.body;

    var uuid = req.params.uuid;
    var carNum = param.carNum;
    var statusCode = param.statusCode;
console.log('arrive collect')
    //Device의 등록여부를 검사 -> 주차장일 경우 parkinglotSeq를 가져온다
    public_model.getDeviceKey(uuid)
        .then(function(rtn){
            var parkinglotSeq = rtn[0].parkinglotSeq;
            if(!parkinglotSeq){
                res.send({
                    resultCode : 500,
                    message : '주차장 등록정보가 확인되지 않습니다.'
                });
                return;
            }

            var chkParam = {
                parkinglotSeq:parkinglotSeq,
                carNum : carNum
            };
            var logData = {
                parkinglotSeq : parkinglotSeq,
                uuid:uuid,
                carNum : carNum,
                statusCode : statusCode
            };

            if(param.message){
                logData.message = param.message;
            }

            console.log('getDeviceKey')
            //로그작성이 프로세스에 영향을 미치지 않음
            createLog(logData);
            console.log('createLog')
            //차량정보, 주차장정보를 통해 주차여부를 확인.
            //여기서부터 로직이 분할된다.
            collect_model.checkCarNum(chkParam)
                .then(function(rtn){
                    var result = {};

                    //case 1. 차량주인이 우리 서비스 이용자일 경우
                    if(rtn.length>0){
                        var rt = rtn[0];
                        var logData = {
                            parkinglotSeq : parkinglotSeq,
                            carNum : rt.carNum,
                            statusCode : statusCode,
                            message : rt.userSeq +' / '+ rt.email+' / '+rt.userName
                        };
                        createLog(logData);

                        result = {
                            resultCode:200,
                            result:{
                                code:'M21',
                                value:0
                            }
                        };
                        //case 2. 차량주인이 우리 서비스 이용자가 아닐경우
                    }else {
                        result = {
                            resultCode:200,
                            result : {
                                code:'M22',
                                value:0
                            }
                        }
                    }
                    res.send(result)
                });

        })
};

/*

Log작성 성공여부가 프로세스 흐름에 영향을 미치는 ver


 //로그작성을 위한 기입
 createLog(logData)
 .then(function(rtn){

 //차량정보, 주차장정보를 통해 주차여부를 확인.
 //여기서부터 로직이 분할된다.
 collect_model.checkCarNum(chkParam)
 .then(function(rtn){
 var result = {};

 //case 1. 차량주인이 우리 서비스 이용자일 경우
 if(rtn.length>0){
 var rt = rtn[0];
 var logData = {
 parkinglotSeq : parkinglotSeq,
 carNum : rt.carNum,
 statusCode : statusCode,
 message : rt.userSeq +' / '+ rt.email+' / '+rt.userName
 };
 createLog(logData)
 .then(function(){
 result = {
 resultCode:200,
 data:{
 isUser : true,
 isAllow : rt.isAllow?rt.isAllow : false //차단기 허용 or not
 }
 };
 },function(err){
 res.send({
 resultCode : 500,
 message : 'Error occupation. Check for it'
 })
 });

 //case 2. 차량주인이 우리 서비스 이용자가 아닐경우
 }else {
 result = {
 resultCode:200,
 data : {
 isUser : false
 }
 }
 }
 res.send(result)
 });
 },function(err){
 res.send({
 resultCode : 500,
 message : 'Error occupation. Check for it'
 })
 });

 var createLog = function(param){
 var defer = promise.defer();
 param.seq = null;
 var log = new MongoLog.logger(param);
 log.save(function(err){

 if(err) defer.reject(err);
 else defer.resolve(true)
 });
 return defer.promise;
 };

 */

var createLog = function(param){
    //var defer = promise.defer();
    param.seq = null;
    var log = new MongoLog.logger(param);
    log.save(function(err){

        //if(err) defer.reject(err);
        //else defer.resolve(true)
    });
    //return defer.p                                                                                                                                                                                                                                     0romise;
    return 1;
};