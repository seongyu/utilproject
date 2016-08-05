var express = require('express'),
    routes = require('./routes/index'),
    config = require('./config.js');

config.server(function(app,fn){
    app.use('/', routes);
    fn();
});