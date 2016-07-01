/**
 * Created by LeonKim on 16. 6. 30..
 */
var winston = require('winston'),
    moment = require('moment'),
    fs = require('fs');

var infoRootPath =  './log', errRootPath =  './error',info_filename, err_filename,info_logger,err_logger;
fs.existsSync(infoRootPath) || fs.mkdirSync(infoRootPath);
fs.existsSync(errRootPath) || fs.mkdirSync(errRootPath);

exports.log = function(req,res){
    var param = req.query;

    if(!param.service){
        res.send();
        return;
    }

    if(param.type=='error'){
        err_filename = mkdir_err(param.service);
        err_logger = new winston.Logger({
            transports: [
                new winston.transports.File({
                    level:'error',
                    filename: err_filename,
                    maxsize: 10000 * 2048, // 20mb cut
                    timestamp: function() {return moment().format("YYYY-MM-DD HH:mm:ss"); }
                })
            ]
        });

        err_log(req,res);
    }else{
        info_filename = mkdir_info(param.service);
        info_logger = new winston.Logger({
            transports: [
                new winston.transports.File({
                    level:'info',
                    filename: info_filename,
                    maxsize: 10000 * 2048, // 20mb cut
                    timestamp: function() {return moment().format("YYYY-MM-DD HH:mm:ss"); }
                })
            ]
        });

        info_log(req,res);
    }
};

var info_log = function(req,res){
    var param = req.body;
    var info = {
        ip	: param.ip,
        url : param.url,
        method : param.method,
        param : param.param
    };

    info_logger.log('info',null,info);

    res.end();
};

var err_log = function(req,res){
    var param = req.body;

    err_logger.log('error',null,param);

    res.send();
};

var mkdir_info = function(dir_path){
    var log_path = infoRootPath+'/'+dir_path,
        file_name = log_path+'/'+moment().format('YYYY-MM-DD')+'.log';

    fs.existsSync(log_path) || fs.mkdirSync(log_path);

    return file_name;
};

var mkdir_err = function(dir_path){
    var log_path = errRootPath+'/'+dir_path,
        file_name = log_path+'/'+moment().format('YYYY-MM-DD')+'.log';

    fs.existsSync(log_path) || fs.mkdirSync(log_path);

    return file_name;
};