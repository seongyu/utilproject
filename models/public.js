/**
 * Created by LeonKim on 16. 8. 12..
 */

var Mysql = require('../lib/database'),sql='';

exports.getDeviceKey = function(param){
    var sql = 'select * from parking_iot.tblIotDevice where ?';
    return Mysql.db_mysql(sql,param);
};

exports.udtDeviceKey = function(param){
    var sql = 'update parking_iot.tblIotDevice set ? where ?';
    param.modifyDate = param.regDate;
    delete param.regDate;
    var updateParam = [param,{parkinglotSeq:param.parkinglotSeq}];
    return Mysql.db_mysql(sql,updateParam,'u')
};

exports.crtDeviceKey = function(param){
    var sql = 'insert into parking_iot.tblIotDevice values(null,?,?,?,?,?,?,null)';
    var updateParam = [
        param.parkinglotSeq?param.parkinglotSeq:null,
        param.deviceKey,
        param.deviceType,
        param.deviceDesc?param.deviceDesc:null,
        param.use_yn?param.use_yn:'Y',
        param.regDate
    ];
    return Mysql.db_mysql(sql,updateParam,'u')
};