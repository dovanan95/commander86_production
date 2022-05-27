const fs = require('fs');
const path = require('path');

var multer = require('multer');

var sql = require('mssql');
var mongo = require('mongodb').MongoClient;
const { Module } = require('module');
const { request } = require('express');

var url_mongo = "mongodb://localhost:27017/";
var db_mongo_name = 'httcddh_2022';

var sql_config = {
    user: 'SA',
    password: 'H@yvuilennao1',
    server: '127.0.0.1', 
    database: 'httcddh2018_86_130',
    trustServerCertificate: true 
};

async function loadUserInformation(listUserID)
{
    try
    {
        var inforSet=0;
        var queryString_nameuser = 'select a.id, a.TenDayDu, a.Mobile, a.Phone, b.TenDonVi, c.Title as chuc_vu, d.Title as cap_bac '+ 
        'from DoIT_CanBo as a inner join DoIT_DMDonVi as b on a.id_DonVi = b.id inner join DoIT_DMChucVu as c on a.id_ChucVu = c.id '+
        'inner join DoIT_DMCapBac as d on a.id_CapBac = d.id  where a.id in (';
        for(let i =0; i<listUserID.length;i++){
            queryString_nameuser=queryString_nameuser+ "'"+ listUserID[i] + "'"+",";
        };
        queryString_nameuser=queryString_nameuser+ "1)";
        sql.connect(sql_config, function(err){
            if(err){
                console.log(err);
                return({'result':'connect to database failed!'})
            }
            var request = new sql.Request();
            request.query(queryString_nameuser, function(err,recordSet){
                if(err){
                    console.log(err);
                    //res.send(JSON.stringify({'data': 'no_data'}));
                    return(err);
                }
                if(recordSet)
                {
                    inforSet = recordSet.recordset;
                    return(inforSet);
                }
            })
        })
        return(inforSet);
    }
    catch(error)
    {
        return(error);
    }
    
}

function storage(fileName)
{
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            var dir = './fileServer';
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: function (req, file, callback) {
            callback(null, fileName);
        }
    });
    return storage; 
}

function timestamptoDateConverter(timestamp)
{
    var a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}


module.exports = {loadUserInformation, timestamptoDateConverter, storage}