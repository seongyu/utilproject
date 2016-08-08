/**
 * Created by LeonKim on 16. 8. 5..
 */
var collect_model = require('../models/collect');

exports.postCollect = function(req,res){
    var param = req.query;
    console.log('catch request...');
    console.log('collect parking data...');
    console.log('.');
    console.log('.');
    console.log('.');
    var carNum = param.carNum;
    console.log('check data value of...'+carNum);

    collect_model.checkCarNum({carNum : carNum})
        .then(function(rtn){
            var result = {};
            if(rtn.length>0){
                var rt = rtn[0];
                result = {
                    resultCode:200,
                    data:{
                        isUser : true,
                        isAllow : rt.isAllow?rt.isAllow : false
                    }
                };
            }else {
                result = {
                    resultCode:201,
                    data : {
                        isUser : false
                    }
                }
            }
            res.send(result)
        });
};