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
    .get('/health',onCtrl.getHealth)
    .get('/on',onCtrl.getOn)
    .post('/on',onCtrl.postOn)
    .post('/parking/:uuid/collect',colCtrl.postCollect);



var indexCtrl = function(req,res){
  util.getIP(function(ip){
    res.render('index',{
        title : 'Park Link',
        content : 'Park Link ready to work...',
        ip : ip,
        service : process.env.NODE_ENV,
        target : config.targetDNS
    });
  });
};

module.exports = router;