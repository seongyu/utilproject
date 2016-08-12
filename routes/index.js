var express = require('express');
var router = express.Router();
var util = require('../lib/util'),
    config = require('../config'),
    onCtrl = require('../controllers/on'),
    colCtrl = require('../controllers/collect');

/* GET home page. */
router.get('/',function(req,res){
  indexCtrl(req,res);
});

router
    .get('/on',onCtrl.getOn)
    .post('/parking/:uuid/collect',colCtrl.postCollect);



var indexCtrl = function(req,res){
  util.getIP(function(ip){
    res.render('index',{
        title : 'IoT_Connector',
        content : 'IoT Connector ready to work on...',
        ip : ip,
        service : process.env.NODE_ENV,
        target : config.targetDNS
    });
  });
};

module.exports = router;