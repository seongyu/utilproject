var express = require('express');
var router = express.Router();
var logger = require('../controllers/log');

/* GET home page. */
router.post('/log', function(req, res, next) {
  logger.log(req,res);
});

module.exports = router;

/*

get parameter
-------------
type = info / error / warning etc... , error의 경우만 error폴더에 쌓임
service = moduApp / moduAdmin / bukchon etc... , service명에 따라 폴더 구분

post parameter
-------------
ip = sender ip or dns
url = request url
method = get/post/put/delete
param = parameter on method
*/