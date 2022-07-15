const fs = require('fs');
const path = require('path');

var multer = require('multer');
var crypto = require('crypto');
var e2e = require('cryptico');
var jwt = require('jsonwebtoken');
var sql = require('mssql');
var mongo = require('mongodb').MongoClient;
const { Module } = require('module');
const { request } = require('express');

var url_mongo = "mongodb://localhost:27017/";
var db_mongo_name = 'httcddh_2022';

var mongoUtil = require( './db' );
var sql_config = {
    user: 'SA',
    password: 'H@yvuilennao1',
    server: '127.0.0.1', 
    database: 'httcddh2018_86_130',
    trustServerCertificate: true 
};
const ACCESS_TOKEN_SECRET = 'btl86_qdndvn';
const REFRESH_TOKEN_SECRET = 'httcddh_blockchain_2022';

async function saveGroupMessage(data)
{
    try
    {
        var dbo = mongoUtil.getDb();
        dbo.collection('groupMessage').insertOne(data, function(err, res){
            if(err){
                console.log(err);
            }
        });
        var groupChat = await dbo.collection('groupCollection').findOne({'groupID':data.groupID});
        console.log(groupChat['member'])
        dbo.collection('user').updateMany({'userID':{$in:groupChat['member']},'chat_history.groupID': data.groupID},
        {$set:{'chat_history.$.timestamp':data.timestamp}});
        dbo.collection('user').updateMany({'userID': {$in:groupChat['member']}}, 
        {$push:{'chat_history':{$each:[], $sort:{'timestamp': -1}}}})
    }
    catch(error)
    {
        console.log(error);
    }
}

async function savePrivateMessage(data)
{
    try
    {
        //var db = await mongo.connect(url_mongo);
        //var dbo = await db.db(db_mongo_name);
        var dbo = mongoUtil.getDb();
        dbo.collection('privateMessage').insertOne(data, function(err, res){
            if(err){
                console.log(err);
            }
            console.log("1 document inserted");
        })
        var myObj = await dbo.collection('user').find({'userID': {'$in':[data.sender, data.receiver]}}).toArray();
        for(let i=0; i<myObj.length;i++)
        {
            console.log(myObj[i].chat_history.length);
            if(myObj[i].chat_history.length==0) //kiem tra lich su tin nhan neu chua co gi thi them moi
            {
                if(myObj[i].userID==data.sender)
                {
                    let prtnObj = {'userID':data.receiver, 'docType':data.docType, 'timestamp':data.timestamp};
                    await dbo.collection('user').updateOne({'userID':myObj[i].userID},{$push:{'chat_history':prtnObj}});
                }
                else if(myObj[i].userID==data.receiver)
                {
                    let prtnObj = {'userID':data.sender, 'docType':data.docType, 'timestamp':data.timestamp};
                    await dbo.collection('user').updateOne({'userID':myObj[i].userID},{$push:{'chat_history':prtnObj}});
                }
                
            }
            else if(myObj[i].chat_history.length>0)
            {
                //trong lich su tin nhan neu da co san thong tin thi kiem tra doi phuong dang chat da co trong danh sach chua.
                //neu co roi thi cap nhat thoi gian. neu chua co thi them moi
                if(myObj[i].userID==data.sender)
                {
                    let flag=0;
                    for(let j=0; j<myObj[i].chat_history.length;j++)
                    {
                        if(myObj[i].chat_history[j].userID==data.receiver)
                        {
                            flag=1;
                        }
                    }
                    if(flag==0)
                    {
                        let prtnObj = {'userID':data.receiver, 'docType':data.docType, 'timestamp':data.timestamp};
                        await dbo.collection('user').updateOne({'userID':myObj[i].userID},{$push:{'chat_history':prtnObj}});
                    }
                    else if(flag==1)
                    {
                        await dbo.collection('user').updateOne({'userID':data.sender, 'chat_history.userID':data.receiver},
                            {$set:{'chat_history.$.timestamp':data.timestamp}});
                    }
                }
                else if(myObj[i].userID==data.receiver)
                {
                    let flag=0;
                    for(let j=0; j<myObj[i].chat_history.length;j++)
                    {
                        if(myObj[i].chat_history[j].userID==data.sender)
                        {
                            flag=1;
                        }
                    }
                    if(flag==0)
                    {
                        let prtnObj = {'userID':data.sender, 'docType':data.docType, 'timestamp':data.timestamp};
                        await dbo.collection('user').updateOne({'userID':myObj[i].userID},{$push:{'chat_history':prtnObj}});
                    }
                    else if(flag==1)
                    {
                        await dbo.collection('user').updateOne({'userID':data.receiver, 'chat_history.userID':data.sender},
                            {$set:{'chat_history.$.timestamp':data.timestamp}});
                    }
                }
            }
        }
        await dbo.collection('user').updateMany({'userID': {$in:[data.sender, data.receiver]}}, 
        {$push:{'chat_history':{$each:[], $sort:{'timestamp': -1}}}})
    }
    catch(error)
    {
        console.log(error);
    }
    
}

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
    var dbo = mongoUtil.getDb();
    if(receiver!=000)
    {  
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
    else if(receiver==000)
    {
        //check one
        var myObj = await dbo.collection('user').findOne({'userID': sender}); 
        var unregisterSecure=[];
            if(myObj && !myObj.hasOwnProperty('secureKey'))
            {
                unregisterSecure.push({'userID':myObj.userID, 'username':myObj.username});
            }
        
        return(unregisterSecure);
    }

}

async function verifyPrivKeyRSA(userID, publicKey){
    var dbo = mongoUtil.getDb();
    var myObj = await dbo.collection('user').findOne({'userID': userID});
    if(myObj && myObj.hasOwnProperty('secureKey'))
    {
        let rsaPublicKey = myObj.secureKey.publicKeyRSA;
        if(publicKey==rsaPublicKey)
        {
            return({'data':'ok'});
        }
        else if(publicKey!=rsaPublicKey)
        {
            return({'data':'ng'});
        }
    }
    else
    {
        return({'data':'ng'});
    }
}

async function systemMessage(message, receiver)
{
    try
    {
        var dbo = mongoUtil.getDb();
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

        require('./socketIO').sendMessMultiSocket(receiver,'incoming_mess', messObj);

    }
    catch(error)
    {
        console.log(error);
    }


}

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function sendMessMultiSocket(socketIo, online_account, receiverID, socket_event, socket_object){
    for(let i=0;i<online_account.length;i++){
        if(online_account[i].userID==receiverID){
            socketIo.to(online_account[i].socketID).emit(socket_event, socket_object);
        }
    }
}

function pwdEncryption(password)
{
    var secret_key = 'MAKV2SPBNI99254';
    var salt = Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]) 
    const iteration = 1000;
    const length = 32+16;
    const digest = 'sha1';
    const keyIV = crypto.pbkdf2Sync(secret_key, salt, iteration, length, digest);
    const key = keyIV.slice(0, 32);
    const iv = keyIV.slice(32, 32 + 16);
    const inputEncoding = 'utf16le';
    const outputEncoding = 'base64';
    const algorithm = 'aes-256-cbc';
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, inputEncoding, outputEncoding);
    encrypted += cipher.final(outputEncoding);
    console.log(encrypted);
    return encrypted;
}

function generateAccessToken(id)
{
    return jwt.sign({id},ACCESS_TOKEN_SECRET,{expiresIn:"30 days"});
}

function generateRefreshToken(id)
{
    return jwt.sign({id}, REFRESH_TOKEN_SECRET, {expiresIn:"180 days"});
}

function authenticateAccessToken(req, res, next)
{
    let authHeader = req.headers['authorization'];
    let token = authHeader&&authHeader.split(" ")[1];
    if(!token){
        return res.sendStatus(400);
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user)=>{
        if(error){
            res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

async function blockchainSyncDown(blockList, docType){
    try
    {
        var dbo = mongoUtil.getDb();
        var collection;
        if(docType=='private_message'){
            collection='privateMessage';
        }
        else if(docType=='group_message'){
            collection='groupMessage';
        }
        else if(docType=='secure_private_message'){
            collection='secure_privateMessage';
        }
        var blockData = JSON.parse(blockList.toString()); console.log(blockData);
        for(let i=0; i<blockData.length;i++){
            var messID = blockData[i].Key; 
            var messInMongo = await dbo.collection(collection).findOne({'messID': messID}); 
            if(messInMongo==null){
                var syncObj = JSON.parse(blockData[i]['Record']['rawObj']);
                syncObj.isImportant='true';
                delete syncObj['_id'];
                console.log('block', syncObj);
                await dbo.collection(collection).insertOne(syncObj, function(err, res){
                    if(err){
                        console.log(err);
                    }
                })
            }
        }
        return({'data':'ok'});
    }
    catch(error)
    {
        console.log(error);
    }

}

module.exports = {loadUserInformation, timestamptoDateConverter, sendMessMultiSocket, pwdEncryption, 
    ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, sql_config, blockchainSyncDown,
    storage, checkE2ERegister, systemMessage, verifyPrivKeyRSA, generateString,
    generateAccessToken, generateRefreshToken, authenticateAccessToken, savePrivateMessage, saveGroupMessage}