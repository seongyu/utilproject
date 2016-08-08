/**
 * Created by LeonKim on 16. 6. 30..
 */
var winston = require('winston'),
    moment = require('moment'),
    fs = require('fs');
var mode = process.env.NODE_ENV;
var infoRootPath =  './log', errRootPath =  './error',info_filename, err_filename,info_logger,err_logger;
fs.existsSync(infoRootPath) || fs.mkdirSync(infoRootPath);
fs.existsSync(errRootPath) || fs.mkdirSync(errRootPath);
/*
param = {
      type : info/error,
      service : projectName,
      data : parameter,
      message : string
    }
 */
exports.log = function(param,fn){
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

        err_log(param.message);
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

        info_log(param);
    }
    if(fn && typeof fn==='function')fn();
};

var info_log = function(data){
    if(mode=='production')
        info_logger.log('info',data);
};

var err_log = function(err){
    if(mode=='production')
        err_logger.log('error',err);
};

var mkdir_info = function(dir_path){
    var log_path = infoRootPath+'/'+dir_path,
        file_name = log_path+'/info.'+moment().format('YYYY-MM-DD')+'.log';

    fs.existsSync(log_path) || fs.mkdirSync(log_path);

    return file_name;
};

var mkdir_err = function(dir_path){
    var log_path = errRootPath+'/'+dir_path,
        file_name = log_path+'/error.'+moment().format('YYYY-MM-DD')+'.log';

    fs.existsSync(log_path) || fs.mkdirSync(log_path);

    return file_name;
};