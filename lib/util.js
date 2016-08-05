var os = require('os');
var ifaces = os.networkInterfaces(),
    config = require('../config.js');

exports.getIP = function(fn){
    var result = [];
    var keyArr = Object.keys(ifaces);
    for(var idx in keyArr){
        var ifName = keyArr[idx];

        var arr = ifaces[ifName];
        for(var idx1 in arr){
            if(arr[idx1].family!='IPv6'&&arr[idx1].internal==false){
                var string = ifName +' => '+arr[idx1].address+':'+config.port;
                result.push(string);
            }
        }
    }
    fn(result)
};