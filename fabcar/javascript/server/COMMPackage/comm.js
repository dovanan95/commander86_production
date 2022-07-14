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

router.post('/loadMorePrivateMess', authenticateAccessToken, async function(req,res){
    try{
        var dbo = mongoUtil.getDb();
        var chatBlocks = await dbo.collection('privateMessage').find({$or:[{'sender':req.body.my_ID,'receiver':req.body.partner_ID},
        {'sender':req.body.partner_ID,'receiver':req.body.my_ID}]}).sort({'timestamp':-1}).limit(req.body.limit).skip(req.body.skip).toArray();
        res.send(JSON.stringify(chatBlocks))
    }
    catch(error){
        console.log(error);
    }
});

router.post('/loadMoreGroupMess', authenticateAccessToken, async function(req, res){
    try
    {
        var dbo = mongoUtil.getDb();
        var chatBlocks = await dbo.collection('groupMessage').find({'groupID': req.body.groupID})
        .sort({'timestamp': -1}).limit(req.body.limit).skip(req.body.skip).toArray();
        res.send(JSON.stringify(chatBlocks));
    }
    catch(error)
    {
        console.log(error)
    }
});


router.post('/loadMoreChatHist', authenticateAccessToken, async function(req, res){

})


router.post('/blockchainSyncPrivateMess', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var dbo = mongoUtil.getDb();
        var userID = req.user.id;
        var docType = req.body.docType;
        if(docType=='private_message'){
            var queryString = {
                "selector":{
                    "$or":[
                        {"sender": userID.toString(), "receiver": String(req.body.receiverID)},
                        {"sender": String(req.body.receiverID), "receiver": userID.toString()}
                    ],
                    "docType": docType,
                    "timestamp": {"$gt": null}
                },
                "sort":[{"timestamp":"desc"}],
                "use_index": ["_design/indexPrivMessDoc", "indexPrivMess"]
            }
            var blocks_result = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
            console.log(JSON.parse(blocks_result.toString()));
            var result = await app_helper.blockchainSyncDown(blocks_result, docType)
            res.send({'data': 'ok'});
        }
    }
    catch(error)
    {
        console.log(error);
    }
    
})
router.post('/blockchainSyncGroupMess', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var dbo = mongoUtil.getDb();
        var userID = req.user.id;
        var docType = req.body.docType;
        if(docType=='group_message'){
            var queryString = {
                "selector":{
                    "room_id": req.body.receiverID,
                    "docType": req.body.docType,
                    "timestamp": {"$gt": null}
                },
                "sort":[{"timestamp":"desc"}],
                "use_index": ["_design/indexPrivMessDoc", "indexPrivMess"]
            }
            var blocks_result = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
            //console.log(JSON.parse(blocks_result.toString()));
            //console.log(JSON.parse(JSON.parse(blocks_result.toString())[0]['Record']['rawObj']))
            var ressult = await app_helper.blockchainSyncDown(blocks_result, docType)
            res.send({'data': 'ok'});
        }
    }
    catch(error)
    {
        console.log(error);
    }
    
});

router.post('/forwardMessage', authenticateAccessToken, async function(req, res){
    try
    {
        console.log(req.body);
        res.send({'data':'ok'});
    }
    catch(error)
    {
        console.log(error)
    }
})

module.exports={router}