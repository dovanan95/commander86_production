var mongoUtil = require( '../db' );
var multer = require('multer');
var app_helper = require('../app_helper');
var blockChain = require('../blockchain');
const express = require('express');
const router = express.Router();
var sql = require('mssql');
var sql_config = app_helper.sql_config;
var jwt = require('jsonwebtoken');

async function contract(){
    const contract = await blockChain.contract();
    return contract;
}

async function saveSecurePrivateMessage(data)
{
    try
    {
        var dbo = mongoUtil.getDb();
        
        dbo.collection('secure_privateMessage').insertOne(data, function(err, res){
            if(err){
                console.log(err);
            }
            console.log("1 document inserted");
        })
        var myObj = await dbo.collection('user').find({'userID': {$in:[data.sender, data.receiver]} }).toArray();
        for(let i=0;i<myObj.length;i++){
            if(!myObj[i].secure_chat_history||myObj[i].secure_chat_history.length==0){
                if(myObj[i].userID==data.sender){
                    let prtnObj = {'userID':data.receiver, 'docType':data.docType, 'timestamp':data.timestamp};
                    await dbo.collection('user').updateOne({'userID': myObj[i].userID},{$push:{'secure_chat_history':prtnObj}});
                }
                else if(myObj[i].userID==data.receiver){
                    let prtnObj = {'userID':data.sender, 'docType':data.docType, 'timestamp':data.timestamp};
                    await dbo.collection('user').updateOne({'userID': myObj[i].userID},{$push:{'secure_chat_history':prtnObj}});
                }
            }
            else if(myObj[i].secure_chat_history && myObj[i].secure_chat_history.length>0){
                if(myObj[i].userID==data.sender){
                    let flag=0;
                    for(let j=0; j<myObj[i].secure_chat_history.length;j++)
                    {
                        if(myObj[i].secure_chat_history[j].userID==data.receiver)
                        {
                            flag=1;
                        }
                    }
                    if(flag==0)
                    {
                        let prtnObj = {'userID':data.receiver, 'docType':data.docType, 'timestamp':data.timestamp};
                        await dbo.collection('user').updateOne({'userID':myObj[i].userID},{$push:{'secure_chat_history':prtnObj}});
                    }
                    else if(flag==1)
                    {
                        await dbo.collection('user').updateOne({'userID':myObj[i].userID, 'secure_chat_history.userID':data.receiver},
                            {$set:{'secure_chat_history.$.timestamp':data.timestamp}});
                    }
                }
                else if(myObj[i].userID==data.receiver){
                    let flag=0;
                    for(let j=0; j<myObj[i].secure_chat_history.length;j++)
                    {
                        if(myObj[i].secure_chat_history[j].userID==data.sender)
                        {
                            flag=1;
                        }
                    }
                    if(flag==0)
                    {
                        let prtnObj = {'userID':data.sender, 'docType':data.docType, 'timestamp':data.timestamp};
                        await dbo.collection('user').updateOne({'userID':myObj[i].userID},{$push:{'secure_chat_history':prtnObj}});
                    }
                    else if(flag==1)
                    {
                        await dbo.collection('user').updateOne({'userID':myObj[i].userID, 'secure_chat_history.userID':data.sender},
                            {$set:{'secure_chat_history.$.timestamp':data.timestamp}});
                    }
                }
            }
        }


        await dbo.collection('user').updateMany({'userID': {$in:[data.sender, data.receiver]}}, 
            {$push:{'secure_chat_history':{$each:[], $sort:{'timestamp': -1}}}})
    }
    catch(error)
    {
        console.log(error);
    }
    
}

async function sendSecurePrivMessIO(data, socketIo, online_account){
    try
    {
        var secure_data={
            'messID': data.messID,
            'docType': 'secure_private_message',
            'sender': parseInt(data.sender),
            'receiver': parseInt(data.receiver),
            'message': data.message, //ex:[{'userID': 123, encrypted_message: 'e393nd3823d'}] 
            'sender_name': data.sender_name,
            'timestamp':parseInt(Date.now()),
            'isImportant': 'false',
            'seen':[],
        }
        app_helper.sendMessMultiSocket(socketIo, online_account,data.sender,'secure_incoming_mess', secure_data);
        app_helper.sendMessMultiSocket(socketIo, online_account,data.receiver,'secure_incoming_mess', secure_data);
        await saveSecurePrivateMessage(secure_data);

    }
    catch(error)
    {
        console.log(error);
    }
}

function authenticateAccessToken(req, res, next)
{
    let ACCESS_TOKEN_SECRET = app_helper.ACCESS_TOKEN_SECRET;
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
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })

router.post('/secure_load_chat_history', authenticateAccessToken, async function(req, res){
    try
    {
        console.log('id body', req.body.id);
        const dbo = mongoUtil.getDb();
        var list_chat_arr = await dbo.collection('user')
            .find({'userID': req.body.id}).project({'secure_chat_history':{$slice: req.body.limit}}).toArray();
        var list_chat = list_chat_arr[0].secure_chat_history;
        sql.connect(sql_config, function(err){
            if(err){
                console.log(err);
                res.send({'result':'connect to database failed!'})
            }
            var request = new sql.Request();
            let queryString = 'select id, TenDayDu from DoIT_CanBo where id in(';

            let arrayQuery = [];
            if(list_chat){
                for (let i = 0; i < list_chat.length; i++) {
                    request.input(`variable_${i}`, sql.Int, list_chat[i].userID);
                   arrayQuery.push(`@variable_${i}`);
    
                }
                queryString += arrayQuery.join(",");
                queryString += ")";
                request.query(queryString, function(err,recordSet){
                    if(err){
                        console.log(err);
                        //res.send(JSON.stringify({'data': 'no_data'}));
                    }
                    if(recordSet)
                    {
                        var nameSet = recordSet.recordset;
                        for (let j=0; j<nameSet.length; j++)
                        {
                            for(let k=0; k<list_chat.length; k++)
                            {
                                if(nameSet[j].id==list_chat[k].userID)
                                {
                                    list_chat[k]['username'] = nameSet[j].TenDayDu;
                                }
                                if(list_chat[k].userID==000)
                                {
                                    list_chat[k]['username'] = 'SYSTEM';
                                }
                            }
                        }
                        res.send(JSON.stringify(list_chat));
                    }
                })
            }
            else if(!list_chat){
                res.send({'data':'ng', 'statusText': 'no history data'});
            }

        })

    }
    catch(error)
    {
        console.log(error);
    }
})

router.post('/secure_chat_peer', authenticateAccessToken, async function(req, res){
    try
    {
        var dbo = mongoUtil.getDb();
        var chatBlocks = await dbo.collection('secure_privateMessage').find({$or:[{'sender':req.body.my_ID,'receiver':req.body.partner_ID},
        {'sender':req.body.partner_ID,'receiver':req.body.my_ID}]}).sort({'timestamp':-1}).limit(req.body.limit).toArray();
        var userObj = await dbo.collection('user').findOne({'userID': req.body.partner_ID});
        var partner_publicKeyRSA = userObj.secureKey.publicKeyRSA;
        res.send(JSON.stringify({'chatBlocks':chatBlocks, 'partner_publicKeyRSA': partner_publicKeyRSA}));

    }
    catch(error)
    {
        console.log(error);
    }
})


router.post('/secure_markImportant', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var dbo = mongoUtil.getDb();
        var chatBlock;
        if(req.body.docType=='secure_private_message')
        {
            chatBlock = await dbo.collection('secure_privateMessage').findOne({'messID': req.body.messID});
            await contract_.submitTransaction('saveSecurePrivateMessage', req.body.messID,
                        chatBlock.sender, chatBlock.sender_name, chatBlock.receiver, JSON.stringify(chatBlock.message), chatBlock.timestamp);
            var resporn = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, Date.now().toString());
            if(JSON.parse(resporn.toString()).messID)
            {
                await dbo.collection('secure_privateMessage').updateOne({'messID': req.body.messID},{$set:{'isImportant': 'true'}})
                res.send({'data':'ok'});
            }
            else if(!JSON.parse(resporn.toString()).messID)
            {
                res.send({'data':'error'});
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
})
router.post('/secure_verifyMessBlockchain', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var dbo = mongoUtil.getDb();
        const updated_Mess = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, req.body.dateTime);
        var update_Mess_json = await JSON.parse(updated_Mess.toString()); console.log(update_Mess_json);
        console.log(JSON.parse(update_Mess_json.content))
        if(update_Mess_json.docType=='secure_private_message')
        {
            await dbo.collection('secure_privateMessage').updateOne({'messID': req.body.messID},{$set:{
                'message': JSON.parse(update_Mess_json.content),
                'sender_name':update_Mess_json.sender_name,
                'sender': parseInt(update_Mess_json.sender),
                'receiver': parseInt(update_Mess_json.receiver),
                'timestamp': parseInt(update_Mess_json.timestamp),
                'isImportant': "true",
                'docType': update_Mess_json.docType
            }})
            console.log(updated_Mess.toString());
            res.send(updated_Mess.toString());
        }
    }
    catch(error)
    {
        console.log(error);
    }
})
module.exports={saveSecurePrivateMessage, sendSecurePrivMessIO, router}
//module.exports=router;