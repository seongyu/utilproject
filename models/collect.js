/**
 * Created by LeonKim on 16. 8. 5..
 */
var Mysql = require('../lib/database'),sql='';

exports.checkCarNum = function(param){
    sql = 'select * from tblCar ' +
    'join tblUser on tblCar.userSeq = tblUser.userSeq ' +
    'where tblCar.carNum like ? ' +
    'and tblCar.status = 1 and tblUser.status = 1;';
    var getParam = [param.carNum];
    return Mysql.db_mysql(sql,getParam);
};

exports.createParking = function(param){
    sql = '';

    return Mysql.db_mysql(sql,param,'u');
};
