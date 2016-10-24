var routes = require('./routes/index'),
    config = require('./config.js');
exports.mongodb = 'mongodb:/52.198.191.86:27017/iot-mongo';



config.server(function(app,fn){

    app.use('/', routes);
    fn();
});


/*

1. 장비 등록 => uuid, parkinglotSeq, careteDt,

 */