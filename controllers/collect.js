/**
 * Created by LeonKim on 16. 8. 5..
 */
var collect_model = require('../models/collect'),
    public_model = require('../models/public'),
    promise = require('q'),
    MongoLog = require('../models/log');

/*
 parkinglotSeq
 carNum
 statusCode
 그 이외 json.stringify
 */
exports.postCollect = function(req,res){
    var param = req.body;
    console.log(param);
    var uuid = req.params.uuid;
    var carNum = param.carNum;
    var statusCode = param.statusCode;

    public_model.getDeviceKey(uuid)
        .then(function(rtn){
            var parkinglotSeq = rtn[0].parkinglotSeq;
            var chkParam = {
                parkinglotSeq:parkinglotSeq,
                carNum : carNum
            };
            var logData = {
                parkinglotSeq : parkinglotSeq?parkinglotSeq:param.parkinglotSeq,
                uuid:uuid,
                carNum : carNum,
                statusCode : statusCode
            };

            if(param.message){
                logData.message = param.message;
            }

            createLog(logData)
                .then(function(rtn){
                    collect_model.checkCarNum(chkParam)
                        .then(function(rtn){
                            var result = {};
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
                                    })

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

        })
};

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