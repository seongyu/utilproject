'use strict';

process.env.NODE_ENV = process.env.NODE_ENV? process.env.NODE_ENV : 'development';

exports.parkinglotSeq = process.env.parkinglot? process.env.parkinglot : '111810';
exports.port = process.env.port? process.env.port : 80;

exports.targetDNS = 'http://52.68.215.38:9001/';
exports.mongodb = 'mongodb://52.68.215.38:27017/iot-mongo';

exports.deviceType = 'lpr';
exports.uuid = null;

var express = require('express'),
    customLog = require('./lib/log'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    promise = require('q'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    public_model = require('./models/public'),
    uuid = require('node-uuid');

var enrollDevice = function(){
    var defer = promise.defer();

    if(fs.existsSync('./registration')){
        fs.readFile('./registration','utf8',function(err,data){
            if(err){
                defer.reject('Can not read UUID')
            }

            try{
                data = JSON.parse(data);
            }catch(e){
                delReg();
                return;
            }
            if(!data.id||data.id.length!==36){
                delReg();
            }else{
                checkDeviceKey(data.id)
                    .then(function(rtn){
                        if(rtn) defer.resolve(data.id);
                        else delReg();
                    },function(err){
                        delReg();
                    })

            }
        })
    }else{
        var writeData = {
            id : uuid.v1({msecs: new Date().getTime()}),
            timestamp : moment().toJSON()
        };
        fs.writeFile('./registration', JSON.stringify(writeData), function(err){
            if(err){
                defer.reject('Can not create UUID');
                return;
            }
            fs.readFile('./registration','utf8',function(err,data){
                if(err){
                    defer.reject('Can not read UUID')
                }
                try{
                    data = JSON.parse(data);
                }catch(e){
                    delReg();
                    return;
                }
                if(!data.id||data.id.length!==36){
                    delReg();
                }else{
                    registToS(data.id)
                        .then(function(rtn){
                            defer.resolve(data.id);
                        },function(err){
                            delReg();
                        });
                }
            })
        })
    }

    return defer.promise;
};

var checkDeviceKey = function(uuid){
    var defer = promise.defer();

    public_model.getDeviceKey({deviceKey:uuid})
        .then(function(rtn){
            if(rtn.length>0){
                defer.resolve(true);
            }else{
                defer.resolve(false);
            }
        },function(err){
            defer.reject(err);
        });

    return defer.promise;
};

var registToS = function(uuid){
    var defer = promise.defer();

    var param = {};
    param.parkinglotSeq = exports.parkinglotSeq;
    param.deviceKey = uuid;
    param.deviceType = exports.deviceType;
    param.deviceDesc = 'Connected with : '+exports.targetDNS;
    param.use_yn = 'N';
    param.regDate = moment().toDate();
    public_model.getDeviceKey({parkinglotSeq:param.parkinglotSeq})
        .then(function(rtn){
            if(rtn.length>0){
                public_model.udtDeviceKey(param)
                    .then(function(rtn){
                        defer.resolve(1);
                    },function(err){
                        defer.reject(0);
                    });
            }else{
                public_model.crtDeviceKey(param)
                    .then(function(rtn){
                        defer.resolve(1);
                    },function(err){
                        defer.reject(0);
                    });
            }
        },function(err){
            defer.reject(0);
        });
    return defer.promise;
};

var delReg = function(){
    console.log('----장비가 훼손되었거나 정보가 잘못되었습니다\n다시 등록하시기 바랍니다.');
    fs.unlink('./registration',function(){
        process.exit(1);
    })
};
//testFn();
//enrollDevice()
exports.server = function(fn){
    enrollDevice()
        .then(function(uuid){
            console.log(uuid)
            exports.uuid = uuid;
            var app = express();
            process.on('uncaughtException',function(err){
                try{
                    customLog.log({
                        service:'iot',
                        message:err.message,
                        type:'error'
                    });
                }catch(exception){
                    console.log('Catched Error => '+exception)
                }
            });
            mongoose.connect(exports.mongodb, function(err) {
                if (err) {
                    console.log(chalk.red('Could not connect to MongoDB!'));
                }
                console.log('Successfully connected witeh... : '+exports.mongodb);
            });

            app.set('views', path.join(__dirname, 'views'));
            app.set('view engine', 'jade');

            app.use(logger('dev'));
            app.use(bodyParser.json());
            app.use(methodOverride());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(cookieParser());
            app.use(express.static(path.join(__dirname, 'public')));

            app.use(function(req,res,next){
                customLog.log({
                    service:'iot',
                    url : req.originalUrl.split('?')[0],
                    method : req.originalMethod,
                    data:req.query
                });
                next();
            });

            fn(app,function(){
                app.use('*',function(req,res,next){
                    var err = new Error('Page Not Found...');
                    customLog.log({
                        service:'iot',
                        message:err.message,
                        type:'error'
                    });
                    err.status = 404;
                    next(err);
                });

                app.use(function(err,req,res,next){
                    res.status(err.status || 500).send(err.message);
                });

                app.listen(exports.port,function(){
                    console.log('Successfully server started for '+ exports.parkinglotSeq +'... : '+exports.port+' as '+process.env.NODE_ENV);
                });
            })
        })
};