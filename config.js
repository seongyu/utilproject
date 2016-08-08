/**
 * Created by LeonKim on 16. 8. 4..
 */
exports.parkinglotSeq = 'undefined_park';
exports.port = 9001;
exports.targetDNS = 'http://localhost:9001/';

process.env.NODE_ENV = process.env.NODE_ENV? process.env.NODE_ENV : 'development';

var express = require('express'),
    customLog = require('./lib/log'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

exports.server = function(fn){
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
            console.log('Successfully server started... : '+exports.port);
        });
    })
};