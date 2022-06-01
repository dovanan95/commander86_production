const fs = require('fs');
const path = require('path');

var multer = require('multer');

var e2e = require('cryptico');

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
async function checkE2ERegister(sender, receiver)
{
    var db = await mongo.connect(url_mongo);
    var dbo = await db.db(db_mongo_name);
    var myObj = await dbo.collection('user').find({'userID': {'$in':[sender, receiver]}}).toArray();
    var unregisterSecure=[];
    for(let i=0; i<myObj.length;i++)
    {
        if(!myObj[i].secureKey)
        {
            unregisterSecure.push({'userID':myObj[i].userID, 'username':myObj[i].username});
        }
    }
    return(unregisterSecure);
}

async function systemMessage(message, receiver)
{
    try
    {
        var db = await mongo.connect(url_mongo);
        var dbo = await db.db(db_mongo_name);
        var messObj ={
            'messID': 'MessPriv.'+'000.'+receiver+'.'+Date.now().toString(),
            'docType': 'private_message',
            'sender': 000,
            'sender_name':'SYSTEM',
            'timestamp':parseInt(Date.now()),
            'receiver': parseInt(receiver),
            'isImportant': 'false',
            'seen':[],
            'message': message
        }
        dbo.collection('privateMessage').insertOne(messObj, function(err, res){
            if(err){
                console.log(err);
            }
            console.log("1 document inserted");
        })
        var myObj = await dbo.collection('user').findOne({'userID': parseInt(receiver)});
        if(myObj.chat_history.length==0)
        {
            let prtnObj = {'userID':000, 'docType':'private_message', 'timestamp':Date.now()};
            await dbo.collection('user').updateOne({'userID':parseInt(receiver)},{$push:{'chat_history':prtnObj}});
        }
        else if(myObj.chat_history.length>0)
        {
            let flag=0;
            for(let j=0; j<myObj.chat_history.length;j++)
            {
                if(myObj.chat_history[j].userID==000)
                {
                    flag=1;
                }
            }
            if(flag==0)
            {
                let prtnObj = {'userID':000, 'docType':'private_message', 'timestamp': Date.now()};
                await dbo.collection('user').updateOne({'userID':parseInt(receiver)},{$push:{'chat_history':prtnObj}});
            }
            else if(flag==1)
            {
                await dbo.collection('user').updateOne({'userID':parseInt(receiver), 'chat_history.userID':000},
                            {$set:{'chat_history.$.timestamp':Date.now()}});
            }
        }
        await dbo.collection('user').updateOne({'userID': parseInt(receiver)}, 
        {$push:{'chat_history':{$each:[], $sort:{'timestamp': -1}}}})
    }
    catch(error)
    {
        console.log(error);
    }


}

module.exports = {loadUserInformation, timestamptoDateConverter, storage, checkE2ERegister, systemMessage}