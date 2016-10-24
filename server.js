var routes = require('./routes/index'),
    mongoose = require('mongoose'),
    config = require('./config.js');



config.server(function(app,fn){
    mongoose.connect(exports.mongodb, function(err) {
        if (err) {
            console.log(chalk.red('Could not connect to MongoDB!'));
        }
        console.log('Successfully connected with... : '+exports.mongodb);
    });
    app.use('/', routes);
    fn();
});


/*

1. 장비 등록 => uuid, parkinglotSeq, careteDt,

 */