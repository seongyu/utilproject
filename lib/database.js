/**
 * Created by LeonKim on 16. 8. 5..
 */
var mysql = require('mysql'),
    promise = require("q"),
    config = require('../config');
var host = process.env.NODE_ENV=='production'?'1.255.57.148':'1.255.57.148';

var db_config = {
    connectionLimit : 30,
    host : host,
    port : '3306',
    user : 'root',
    password : '2015Parky!',
    database : 'parkingshare',
    debug : false
};

var pool = mysql.createPool(db_config);

var db_mysql = function(sql,param,action){
    var defer = promise.defer(),query;
    if(action=='u'){
        pool.getConnection(function(err,conn){
            if(err){throw err}
            query = conn.query(sql,param,function(err,rows){
                checkQuery(query);
                if(err){
                    conn.rollback();
                    conn.release();
                    defer.reject(err);
                }else{
                    rows = JSON.parse(JSON.stringify(rows));
                    conn.commit(function(err){
                        if (err) {
                            conn.rollback();
                            defer.reject(err);
                        }else{
                            defer.resolve(rows);
                        }
                        conn.release();
                    })
                }
            })
        })
    }else{
        query = pool.query(sql,param,function(err,rows){
            checkQuery(query);
            if(err){
                defer.reject(err);
            }else{
                rows = JSON.parse(JSON.stringify(rows));
                defer.resolve(rows);
            }
        })
    }

    return defer.promise;
};

var checkQuery = function(query){
    if(process.env.NODE_ENV=='development') console.log(query.sql);
};



exports.db_mysql = db_mysql;