/**
 * Created by LeonKim on 16. 8. 12..
 */

var Mysql = require('../lib/database'),sql='';

exports.getDeviceKey = function(uuid){
    var sql = 'select * from parking_iot.tblIotDevice where ?';
    var getParam = {deviceKey:uuid};
    return Mysql.db_mysql(sql,getParam);
};

exports.setDeviceKey = function(param){
    var sql = 'insert into parking_iot.tblIotDevice values(null,?,?,?,?,?,?,null)';
    var updateParam = [
        param.parkinglotSeq?param.parkinglotSeq:null,
        param.deviceKey,
        param.deviceType,
        param.deviceDesc?param.deviceDesc:null,
        param.use_yn?param.use_yn:'Y',
        param.reg_date
    ];
    return Mysql.db_mysql(sql,updateParam,'u')
};