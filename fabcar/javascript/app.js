var express = require('express');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('dotenv').config();

var app = express();
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const fs = require('fs');
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
var https = require("https");
const server = https.createServer(options, app);
const cors = require('cors');

const { Gateway, Wallets } = require('fabric-network');

const path = require('path');

var sql = require('mssql');
var mongo = require('mongodb').MongoClient;
const test = require('assert');
const { Socket } = require('socket.io');
var url_mongo = "mongodb://localhost:27017/";
var db_mongo_name = 'httcddh_2022';

var app_helper = require('./server/app_helper');
var sql_config = app_helper.sql_config;

const { dirname } = require('path');
var mongoUtil = require( './server/db' );
const pwdEncryption =(password)=>app_helper.pwdEncryption(password);
const secureChat = require('./server/E2EPackage/secureChat');
const blockChain = require('./server/blockchain');
const socketIOFuntion = require('./server/socketIO');
const commModule = require('./server/COMMPackage/comm');

async function contract(){
    const contract = await blockChain.contract();
    return contract;
}

//------------Security Zone ------------------------//

const ACCESS_TOKEN_SECRET = app_helper.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = app_helper.REFRESH_TOKEN_SECRET;


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

app.post("/refreshtoken",(req,res)=>{
    let refreshtoken= req.body.refreshtoken;
    if(!refreshtoken){
        return res.sendStatus(401);
    }
    jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET, (error, user)=>{
        if(error){
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(user.id); //user data got from decoded refeshtoken sent from client
        res.send({"accessToken":accessToken});
    })
});


//------------ End Security Zone ------------------------//

//------------ Communication Zone -----------------------//

const socketIo = require("socket.io")(server, {
   cors: {
       origin: "*",
   }
 });
//const socketIo = require("socket.io")(server);


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
socketIOFuntion.socketCommunication(socketIo);
var users = socketIOFuntion.users;
var online_account = socketIOFuntion.online_account;

//------------ End Communication Zone -----------------------//

app.set('view engine', 'ejs');
app.set('views', __dirname);
 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(cors());

app.use(express.static(__dirname + '/views_h'));

app.use('/secureChat', secureChat.router);
app.use('/commModule', commModule.router);

//code

app.get('/', function(req, res){
    res.render('./views_h/index', {'data':'Commander System'});
})
app.post('/login',async function(req, res){
    try
    {
        console.log(req.body.pw);
        var encrypted_password = pwdEncryption(req.body.pw);
        sql.connect(sql_config, function(err){
            if(err){
                console.log(err);
                res.send({'result':'connect to database failed!'})
            }
            var request = new sql.Request();
            request.input('TenDangNhap', sql.NVarChar, req.body.id);
            request.input('MatKhau', sql.NVarChar, encrypted_password);
            request.query('select id, TenDayDu from DoIT_CanBo where TenDangNhap=@TenDangNhap and MatKhau=@MatKhau', 
            async function(err, recordSet){
                if(err){
                    res.send({'result':'NG'});
                }
                if(recordSet.recordset.length>0)
                {
                    var uid = recordSet.recordset[0].id;
                    let accessToken = generateAccessToken(uid);
                    let refeshtoken = generateRefreshToken(uid)
                    console.log(recordSet.recordset[0].id);
                    res.send(
                        {
                        'result': 'OK',
                        'myID':uid,
                        'username':recordSet.recordset[0].TenDayDu , 
                        'accessToken': accessToken, 
                        'refreshToken': refeshtoken});
                    const contract_ = await contract();
                    //await contract_.submitTransaction('transfer_login', uid, recordSet.recordset[0].TenDayDu);
                    mongo.connect(url_mongo, async function(err, db){
                        if (err) {throw err}
                        var dbo = db.db(db_mongo_name);
                        var userObj = {
                            'userID': uid,
                            'username': recordSet.recordset[0].TenDayDu,
                            'chat_history':[]
                        }
                        var count_user = await dbo.collection('user').countDocuments({'userID': uid});
                        console.log(count_user)
                        if(count_user==0)
                        {
                            dbo.collection('user').insertOne(userObj, function(err, res){
                                if(err){
                                    console.log(err);
                                }
                                console.log("1 document inserted");
                                db.close();
                            })
                        }
                    })
                }
                else if(recordSet.recordset.length==0)
                {
                    res.send({'result':'NG'});
                }
                
            })
        });
    }
    catch(error){
        console.log(error);
    }
    
})


app.get('/chat', function(req, res){
    console.log(req.query.userID);
    res.render('./views_h/chat');
})


app.post('/load_chat_history', authenticateAccessToken, async function(req, res){
    try
    {
        const dbo = mongoUtil.getDb();
        var list_chat_arr = await dbo.collection('user')
            .find({'userID': req.body.id}).project({'chat_history':{$slice: req.body.limit}}).toArray();
        var list_chat = list_chat_arr[0];
        sql.connect(sql_config, function(err){
            if(err){
                console.log(err);
                res.send({'result':'connect to database failed!'})
            }
            var request = new sql.Request();
            let queryString = 'select id, TenDayDu from DoIT_CanBo where id in(';

            let arrayQuery = [];
            for (let i = 0; i < list_chat.chat_history.length; i++) {
                request.input(`variable_${i}`, sql.Int, list_chat.chat_history[i].userID);
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
                        for(let k=0; k<list_chat.chat_history.length; k++)
                        {
                            if(nameSet[j].id==list_chat.chat_history[k].userID)
                            {
                                list_chat.chat_history[k]['username'] = nameSet[j].TenDayDu;
                            }
                            if(list_chat.chat_history[k].userID==000)
                            {
                                list_chat.chat_history[k]['username'] = 'SYSTEM';
                            }
                        }
                    }
                    res.send(JSON.stringify(list_chat.chat_history));
                }
            })
        })

    }
    catch(error)
    {
        console.log(error);
    }
    
})

//for chat one to one from chat history
app.post('/chat_peer', authenticateAccessToken, async function(req, res){
    try
    {
        var dbo = mongoUtil.getDb();
        var chatBlocks = await dbo.collection('privateMessage').find({$or:[{'sender':req.body.my_ID,'receiver':req.body.partner_ID},
        {'sender':req.body.partner_ID,'receiver':req.body.my_ID}]}).sort({'timestamp':-1}).limit(req.body.limit).toArray();
        res.send(JSON.stringify(chatBlocks))

    }
    catch(error)
    {
        console.log(error);
    }
})


//for chat room 
app.post('/chat_room', authenticateAccessToken, async function(req, res){
    var dbo = mongoUtil.getDb();
    var chatBlocks = await dbo.collection('groupMessage').find({'groupID': req.body.groupID}).sort({'timestamp': -1}).limit(req.body.limit).toArray();
    res.send(JSON.stringify(chatBlocks));
})

//for begin chat with one user from query
app.post('/init_new_chat', function(req, res){
    console.log( {'partner_ID': req.body.partner_ID, 'myID': req.body.myID});
})

//for user search result
app.get('/home', function(req, res){
    res.render('./views_h/home');
})

const sample_user_data_1 ={'userID': 001, 'username': 'Do Van An'};
//for user search
app.get('/searchUserByID', authenticateAccessToken, function(req, res){
    try
    {
        console.log(req.query.id);
        sql.connect(sql_config, function(err){
            if(err){
                console.log(err);
                res.send({'result':'connect to database failed!'})
            }
            var request = new sql.Request();
            request.input('TenDangNhap', sql.NVarChar,'%'+ req.query.id + '%');
            request.query('select a.id, a.TenDayDu, a.Mobile, a.Phone, b.TenDonVi, c.Title as chuc_vu, d.Title as cap_bac '+ 
            'from DoIT_CanBo as a inner join DoIT_DMDonVi as b on a.id_DonVi = b.id inner join DoIT_DMChucVu as c on a.id_ChucVu = c.id '+
            'inner join DoIT_DMCapBac as d on a.id_CapBac = d.id where a.TenDangNhap like @TenDangNhap',function(err, recordSet){
                if(err){
                    console.log(err);
                    res.send(JSON.stringify({'data': 'no_data'}));
                }
                if(recordSet)
                {
                    console.log(recordSet);
                    res.send(JSON.stringify({'data': recordSet.recordset}));
                }
            })
        })
    }
    catch(error)
    {
        console.log(error);
    }
    
})

app.get('/user_information', function(req, res){

    sql.connect(sql_config, function(err){
        if(err){
            console.log(err);
            res.send({'result':'connect to database failed!'})
        }
        var request = new sql.Request();
        request.input('id', sql.Int,req.query.id_user);
        request.query('select a.id, a.TenDayDu, a.Mobile, a.Phone, b.TenDonVi, c.Title as chuc_vu, d.Title as cap_bac '+ 
        'from DoIT_CanBo as a inner join DoIT_DMDonVi as b on a.id_DonVi = b.id inner join DoIT_DMChucVu as c on a.id_ChucVu = c.id '+
        'inner join DoIT_DMCapBac as d on a.id_CapBac = d.id where a.id =@id',function(err, recordSet){
            if(err){
                console.log(err);
                res.send(JSON.stringify({'data': 'no_data'}));
            }
            if(recordSet && recordSet.recordset.length>0)
            {
                console.log(recordSet);
                res.render('./views_h/profile',
                {
                    'data':JSON.stringify(
                        {
                            'userID': recordSet.recordset[0].id, 
                            'name': recordSet.recordset[0].TenDayDu,
                            'Phone': recordSet.recordset[0].Mobile,
                            'dept': recordSet.recordset[0].TenDonVi,
                            'rank': recordSet.recordset[0].cap_bac,
                            'position': recordSet.recordset[0].chuc_vu
                        }
                    )
                })
            }
        })
    })
})

app.post('/markImportant', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var dbo = mongoUtil.getDb();
        var chatBlock;
        if(req.body.docType=='private_message')
        {
            chatBlock = await dbo.collection('privateMessage').findOne({'messID': req.body.messID});
            await contract_.submitTransaction('savePrivateMessage', req.body.messID,
                                chatBlock.sender, chatBlock.sender_name, chatBlock.receiver, chatBlock.message, chatBlock.timestamp);
            var resporn = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, Date.now().toString());
            if(JSON.parse(resporn.toString()).messID)
            {
                await dbo.collection('privateMessage').updateOne({'messID': req.body.messID},{$set:{'isImportant': 'true'}})
                res.send({'data':'ok'});
            }
            else if(!JSON.parse(resporn.toString()).messID)
            {
                res.send({'data':'error'});
            }
        }
        else if(req.body.docType == 'group_message')
        {
            chatBlock = await dbo.collection('groupMessage').findOne({'messID': req.body.messID});
            await contract_.submitTransaction('saveGroupMessage', req.body.messID,chatBlock.groupID,
                                chatBlock.sender, chatBlock.sender_name,  chatBlock.message, chatBlock.timestamp);
            var resporn = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, Date.now().toString());
            if(JSON.parse(resporn.toString()).messID)
            {
                await dbo.collection('groupMessage').updateOne({'messID': req.body.messID},{$set:{'isImportant': 'true'}})
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

app.post('/verifyMessBlockchain', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var dbo = mongoUtil.getDb();
        const updated_Mess = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, req.body.dateTime);
        var update_Mess_json = await JSON.parse(updated_Mess.toString()); console.log(update_Mess_json);
        if(update_Mess_json.docType=='private_message')
        {
            await dbo.collection('privateMessage').updateOne({'messID': req.body.messID},{$set:{
                'message': update_Mess_json.content,
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
        else if(update_Mess_json.docType=='group_message')
        {
            await dbo.collection('groupMessage').updateOne({'messID': req.body.messID},{$set:{
                'message': update_Mess_json.content,
                'sender_name':update_Mess_json.sender_name,
                'sender': parseInt(update_Mess_json.sender),
                'timestamp': parseInt(update_Mess_json.timestamp),
                'isImportant': "true",
                'docType': update_Mess_json.docType,
                'groupID': update_Mess_json.room_id
            }})
            console.log(updated_Mess.toString());
            res.send(updated_Mess.toString());
        }
        

    }
    catch(error)
    {
        console.log(error);
        res.send( {"data": "error"});
    }
})

app.get('/newGroup', function(req, res){
    res.render('./views_h/newGroup')
});

app.get('/authenOnLoad', authenticateAccessToken, function(req, res){
    res.send(req.user);
});

app.get('/medium', function(req, res){
    res.render('./views_h/medium');
})

app.post('/generateGroup', authenticateAccessToken, async function(req,res){
    try{
        var dbo = mongoUtil.getDb();
        var groupID = 'groupComm'+ req.body.admin + req.body.groupName.replace(/\s/g, '') + Date.now().toString();
        var intUserList = [];
        for(let i=0; i<req.body.userID.length;i++){
            intUserList.push(parseInt(req.body.userID[i]));
        }
        intUserList.push(parseInt(req.body.admin));
        var userinMongo = await dbo.collection('user').find({'userID':{$in:intUserList}}).toArray();
  
        var new_intUserList=[];
        for(let j=0;j<userinMongo.length;j++){
            new_intUserList.push(userinMongo[j]['userID']);
        }

        var data = {
            'groupID': groupID,
            'groupName': req.body.groupName,
            'admin': req.body.admin,
            'member': new_intUserList,
            'dateCreate': parseInt(Date.now())
        };
        
        dbo.collection('groupCollection').insertOne(data, function(err, res){
            if(err){
                console.log(err);
            }
        });
        //db.privateMessage.updateMany({'sender':{$in:[777, 783]}},{$set:{'key':'test value'}}) -> update for multi different item id
        var groupHistoryObject = {'groupID': groupID, 'groupName': req.body.groupName, 'docType': 'group_message', 'timestamp': parseInt(Date.now())};
        dbo.collection('user').updateMany({'userID':{$in:new_intUserList}},{$push:{'chat_history':groupHistoryObject}});;
        new_intUserList.forEach(userID =>{
            var new_groupInfo = {'docType': 'group_message', 'groupID': groupID, 'groupName': req.body.groupName};
            app_helper.sendMessMultiSocket(socketIo,socketIOFuntion.online_account,userID,'kickinGroup',new_groupInfo);
        })
        res.send({'data':'ok'});
    }
    catch(error)
    {
        console.log(error);
    }
})

app.get('/groupOptions', function(req, res){
    var id_group = req.query.id;
    res.render('./views_h/groupOptions', {'id_group': id_group});    
})

app.post('/loadOptions', authenticateAccessToken, async function(req, res){
    try
    {
        var docType = req.body.docType;
        var dbo = mongoUtil.getDb();
        if(docType=='group_message')
        {
            var id_group = req.body.id_group;
            var userID = parseInt(req.body.userID);
            var group = await dbo.collection('groupCollection').findOne({'groupID': id_group});
            var listUserID = group.member;
            var groupName = group.groupName;
            var admin = group.admin;
            var inforSet=0;
            sql.connect(sql_config, function(err){
                if(err){
                    console.log(err);
                    res.send({'result':'connect to database failed!'})
                }
                var request = new sql.Request();
                let queryString = 'select a.id, a.TenDayDu, a.Mobile, a.Phone, b.TenDonVi, c.Title as chuc_vu, d.Title as cap_bac '+ 
                'from DoIT_CanBo as a inner join DoIT_DMDonVi as b on a.id_DonVi = b.id inner join DoIT_DMChucVu as c on a.id_ChucVu = c.id '+
                'inner join DoIT_DMCapBac as d on a.id_CapBac = d.id  where a.id in (';

                let arrayQuery = [];
                for (let i = 0; i < listUserID.length; i++) {
                    request.input(`variable_${i}`, sql.Int, listUserID[i]);
                   arrayQuery.push(`@variable_${i}`);
    
                }
                queryString += arrayQuery.join(",");
                queryString += ")";
                request.query(queryString, function(err,recordSet){
                    if(err){
                        console.log(err);
                        //res.send(JSON.stringify({'data': 'no_data'}));
                        res.send(err);
                    }
                    if(recordSet)
                    {
                        inforSet = recordSet.recordset;
                        if(admin==userID)
                        {
                            res.send({'data': inforSet, 'isAdmin':'true', 'admin': admin, 'groupName': groupName});
                        }
                        else if( admin != userID)
                        {
                            res.send({'data': inforSet, 'isAdmin':'false', 'admin': admin, 'groupName': groupName});
                        }
                    }
                })
            })
        }
    }
    catch(error)
    {
        console.log(error);
    }
})

app.post('/changeGroupName', authenticateAccessToken, async function(req, res){
    try
    {
        var userID = req.user.id;
        var newGroupName = req.body.groupName;
        var groupID = req.body.groupID; 
        var dbo = mongoUtil.getDb();
        var group= await dbo.collection('groupCollection').findOne({'groupID':groupID});
        var memList = group.member;
        if(group.admin==userID)
        {
            await dbo.collection('groupCollection').updateOne({'groupID':groupID}, {$set:{'groupName': newGroupName}});
            await dbo.collection('user').updateMany({'userID':{$in:memList}, 'chat_history.groupID':groupID},{$set:{'chat_history.$.groupName':newGroupName}}); 
            res.send({'data':'ok'});
        }
    }
    catch(error)
    {
        console.log(error);
        res.send({'data': error});

    }
});
app.post('/updateGroup', authenticateAccessToken, async function(req, res){
    try
    {
        var userID = req.user.id;
        var groupName = req.body.groupName;
        var listMem = req.body.userListID;
        var groupID= req.body.groupID;
        var dbo = mongoUtil.getDb();
        var group= await dbo.collection('groupCollection').findOne({'groupID':groupID});
        var old_memList = group.member;

        var oldMemFilt = old_memList.filter(x => !listMem.includes(x));
        var newMemFilt = listMem.filter(x => !old_memList.includes(x));
        if(group.admin==userID)
        {
            await dbo.collection('user').updateMany({'userID':{$in:oldMemFilt}},{$pull:{'chat_history':{'groupID':groupID}}});
            var newGroupObj = {'groupID': groupID, 'groupName': groupName, 'docType': 'group_message', 'timestamp': parseInt(Date.now())};
            await dbo.collection('user').updateMany({'userID':{$in:newMemFilt}},{$push:{'chat_history': {$each:[newGroupObj], $sort:{'timestamp': -1}}}});
            if(group.groupName!= groupName)
            {
                await dbo.collection('user').updateMany({'userID':{$in:listMem}, 'chat_history.groupID':groupID},{$set:{'chat_history.$.groupName':groupName}});
            }
            await dbo.collection('groupCollection').updateOne({'groupID':groupID}, {$set:{'groupName': groupName, 'member':listMem}}); 
            
        }
        res.send({'data':'ok'});
        //socketIo.to(users[userID]).emit('kickoutGroup', groupID);
        socketIo.in(groupID).emit('kickoutGroup', {'groupID': groupID,'userID':oldMemFilt});
    }
    catch(error)
    {
        console.log(error);
    }
})

app.post('/leaveGroup', authenticateAccessToken, async function(req, res){
    try
    {
        var userID = req.user.id;
        var groupID = req.body.groupID;
        var dbo = mongoUtil.getDb();
        var group= await dbo.collection('groupCollection').findOne({'groupID':groupID});
        var memList = group.member;
        if(group.admin == userID)
        {
            await dbo.collection('groupCollection').updateOne({'groupID': groupID}, {$set:{'admin': memList[0]}})
        };
        await dbo.collection('groupCollection').updateOne({'groupID': groupID}, {$pull:{'member':userID}});
        await dbo.collection('user').updateOne({'userID': userID},{$pull:{'chat_history':{'groupID':groupID}}})
        socketIo.in(groupID).emit('kickoutGroup', {'groupID': groupID,'userID':[userID]});
        res.send({'data': 'ok'});
    }
    catch(error)
    {
        console.log(error);
        res.send({'data':'ng'});
    }
});

app.post('/deleteGroup', authenticateAccessToken, async function(req, res){
    try{
        var userID = req.user.id;
        var groupID = req.body.groupID;
        var dbo = mongoUtil.getDb();
        var group= await dbo.collection('groupCollection').findOne({'groupID':groupID});
        var memList = group.member;
        if(group.admin == userID)
        {
            await dbo.collection('groupCollection').deleteOne({'groupID': groupID});
            await dbo.collection('user').updateMany({'userID':{$in:memList}},{$pull:{'chat_history':{'groupID':groupID}}});
            await dbo.collection('groupMessage').deleteMany({'groupID':groupID});
            socketIo.in(groupID).emit('kickoutGroup', {'groupID': groupID,'userID':memList});
            res.send({'data': 'ok'});
        };
    }
    catch(error)
    {
        console.log(error);
        res.send({'data': 'ng'});
    }
});

app.post('/seenUpdate', authenticateAccessToken, async function(req, res){
    try
    {
        var userID = req.user.id;
        var dbo = mongoUtil.getDb();
        if(req.body.docType=='private_message')
        {
            var messList = req.body.seenMessID;
            let timestamp = req.body.timestamp;
            if(req.body.seenMessID.length>0)
            {
                console.log(req.body);
                await dbo.collection('privateMessage').updateMany({'messID':{$in: messList}},
                {$push:{'seen':{'userID': userID,'timestamp': timestamp}}});
            }
        }
        else if(req.body.docType=='group_message')
        {
            var messList = req.body.seenMessID;
            let timestamp = req.body.timestamp;
            if(req.body.seenMessID.length>0)
            {
                await dbo.collection('groupMessage').updateMany({'messID':{$in: messList}},
                {$push:{'seen':{'userID': userID,'timestamp': timestamp}}});
            }
        }
        res.send({'data': 'ok'});
    }
    catch(error)
    {
        res.send({'data': error});
    }

})

app.get('/getMessInfo', authenticateAccessToken, async function(req, res){
    try
    {
        var userID = req.user.id;
        var dbo = mongoUtil.getDb();
        if(req.query.docType=='private_message')
        {
            let seenTime;
            var message = await dbo.collection('privateMessage').findOne({'messID':req.query.messID}); 
            
            if(message.seen && message.seen.length>0)
            {
                seenTime = app_helper.timestamptoDateConverter(message.seen[0].timestamp);
            }
            else if(!message.seen || message.seen.length==0)
            {
                seenTime = 0;
            }
            let sendTime = app_helper.timestamptoDateConverter(message.timestamp);
            res.send({'docType':req.query.docType, 'sendTime': sendTime, 'seenTime': seenTime});
        }
        else if(req.query.docType=='group_message')
        {
            var message = await dbo.collection('groupMessage').findOne({'messID':req.query.messID});
            let sendTime = app_helper.timestamptoDateConverter(message.timestamp);
            let seenTime = [];
            if(message.seen && message.seen.length>0)
            { 
                sql.connect(sql_config, function(err){
                    if(err){
                        console.log(err);
                        res.send({'result':'connect to database failed!'})
                    }
                    var request = new sql.Request();
                    let queryString = 'select id, TenDayDu from DoIT_CanBo where id in(';

                    let arrayQuery = [];
                    for (let i = 0; i < message.seen.length; i++) {
                        request.input(`variable_${i}`, sql.Int, message.seen[i].userID);
                       arrayQuery.push(`@variable_${i}`);
    
                    }
                    queryString += arrayQuery.join(",");
                    queryString += ")";
                    request.query(queryString, function(err, recordSet){
                        if(err){
                            console.log(err);
                            //res.send(JSON.stringify({'data': 'no_data'}));
                        }
                        if(recordSet)
                        {
                            let seenArray =[];
                            for(let k=0; k<recordSet.recordset.length;k++)
                            {
                                for(let l=0; l<message.seen.length;l++)
                                {
                                    if(k==l)
                                    {
                                        let seenObj = {
                                            'userID': message.seen[l].userID,
                                            'userName': recordSet.recordset[k].TenDayDu,
                                            'dateTime': app_helper.timestamptoDateConverter(message.seen[l].timestamp)
                                        }
                                        seenArray.push(seenObj);
                                    }
                                }
                            }
                            console.log(seenArray);
                            res.send({'docType':req.query.docType, 'sendTime': sendTime, 'seenTime': seenArray})
                        }
                    })
                })
            }
            else if((message.seen && message.seen.length==0) || !message.seen)
            {
                res.send({'docType':req.query.docType, 'sendTime': sendTime, 'seenTime': 0})
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
    
})


app.post('/sendFile', authenticateAccessToken, async function(req, res){
    try
    {
        let docType = req.headers.doctype; 
        if(docType=='private_message')
        {
            let sender_name = req.headers.sender_name;
            let sender = req.headers.sender;
            let receiver = req.headers.receiver;
            let fileName = 'file'+sender+ receiver+ docType+ Date.now().toString()
            var upload = multer({ storage : app_helper.storage(fileName)}).single('files');
            upload(req,res, async function(err) {
                if(err) {
                    return res.end("Error uploading file.");
                }
                console.log(req.file.originalname);
                res.send({'data':'ok'});
                let messID = 'MessPriv.'+sender+'.'+receiver+'.'+Date.now().toString()
                var privMessObj = {
                    'messID': messID,
                    'docType': 'private_message',
                    'sender': parseInt(sender),
                    'receiver': parseInt(receiver),
                    'message': fileName,
                    'sender_name': decodeURIComponent(sender_name),
                    'timestamp':parseInt(Date.now()),
                    'isImportant': 'false',
                    'seen':[],
                    'isFile': 'true',
                    'originalFilename': req.file.originalname
                }
                await savePrivateMessage(privMessObj);
                app_helper.sendMessMultiSocket(socketIo,online_account,parseInt(sender),'incoming_mess', privMessObj);
                app_helper.sendMessMultiSocket(socketIo,online_account,parseInt(receiver),'incoming_mess', privMessObj);
            });
        }
        else if(docType=='group_message')
        {
            let sender_name = req.headers.sender_name;
            let sender = req.headers.sender;
            let groupID = req.headers.groupid; console.log(groupID);
            let groupName = req.headers.groupname;
            let fileName = 'file'+sender+groupID+docType+Date.now().toString();
            var upload = multer({storage: app_helper.storage(fileName)}).single('files');
            upload(req, res, async function(err){
                if(err){
                    return res.end("Error uploading file.");
                }
                res.send({'data':'ok'});
                var messID = 'MessGroup.'+sender+'.'+groupID+'.'+Date.now().toString();
                var groupMessObj = {
                    'messID': messID,
                    'docType': 'group_message',
                    'sender': parseInt(sender),
                    'groupID': groupID,
                    'message': fileName,
                    'sender_name': decodeURIComponent(sender_name),
                    'timestamp':parseInt(Date.now()),
                    'isImportant': 'false',
                    'seen':[],
                    'isFile': 'true',
                    'originalFilename': req.file.originalname
                }
                await saveGroupMessage(groupMessObj);
                socketIo.in(groupID).emit('incoming_mess',{
                    'messID': 'MessGroup.'+sender+'.'+groupID+'.'+Date.now().toString(),
                    'sender': sender, 
                    'groupID': groupID, 
                    'groupName': decodeURIComponent(groupName),
                    'message': fileName, 
                    'sender_name': decodeURIComponent(sender_name),
                    'docType': 'group_message',
                    'isFile': 'true',
                    'originalFilename': req.file.originalname
                })
            })
        }
        
    
    }
    catch(error)
    {
        console.log(error);
        res.send({'data':'error'});
    }
})

app.get('/downloadFile', authenticateAccessToken, async function(req, res){
    res.download(`./fileServer/`+ req.query.fileName, function(error){
        console.log(error)
    });
})

app.get('/checkE2ERegisterAPI', authenticateAccessToken, async function(req, res){
    try
    {
        var dbo = mongoUtil.getDb();
        var sender = parseInt(req.query.senderID);
        var receiver = parseInt(req.query.receiverID);
        var unregisterSecureList = await app_helper.checkE2ERegister(sender, receiver);
        var message = `<div>
                            <p>vui long dang ky de lien lac bang tin nhan ma hoa</p> 
                            <a style="color:orange;"  href="/registerE2EService">
                                Dang ky tai day
                            </a>
                        </div>`;
        if(unregisterSecureList.length==0){
            if(receiver!=000)
            {
                let receiver_publicKeyRSA;
                var myObj = await dbo.collection('user').findOne({'userID': receiver});
                if(myObj && myObj.hasOwnProperty('secureKey')) {
                    receiver_publicKeyRSA=myObj.secureKey.publicKeyRSA;
                }
                res.send({'data':'ok', 'receiver_publicKeyRSA': receiver_publicKeyRSA});
            }
            else if(receiver==000)
            {
                res.send({'data':'ok'});
            }
            
        }
        else if(unregisterSecureList.length>0)
        {
            for(let i=0;i<unregisterSecureList.length;i++)
            {
                if(unregisterSecureList[i].userID==sender)
                {
                    //res.send({'data':'ng', 'status':'registerRequire'});
                }
                else if(unregisterSecureList[i].userID==receiver && unregisterSecureList[i].userID!=000)
                {
                    console.log(unregisterSecureList[i].userID, receiver)
                    var registerRequireObj={
                        'messID': 'MessPriv.'+'000.'+receiver+'.'+Date.now().toString(),
                        'docType': 'private_message',
                        'sender': parseInt(sender),
                        'sender_name':'SYSTEM',
                        'timestamp':parseInt(Date.now()),
                        'receiver': parseInt(receiver),
                        'isImportant': 'false',
                        'seen':[],
                        'message': message
                    }
                    await savePrivateMessage(registerRequireObj);
                    socketIo.to(users[parseInt(receiver)]).emit('incoming_mess', registerRequireObj);
                    //res.send({'data':'ng', 'status':'waitingRequire'});
                }
            }
            res.send({'data':'ng', 'status':'registerRequire', 'unregList': unregisterSecureList});
        }
    }
    catch(error)
    {
        console.log(error)
    }
})

app.get('/registerE2EService', function(req, res){
    res.render('./views_h/secureChatRegister');
})

app.post('/verifyPrivKeyRSA', authenticateAccessToken, async function(req,res){
    try
    {
        var userID = req.user.id;
        var publicKeyRSA = req.body.publicKeyRSA;
        var result = await app_helper.verifyPrivKeyRSA(userID, publicKeyRSA);
        res.send(result);
    }
    catch(error)
    {
        console.log({'data': 'ng'});
    }

})

app.post('/registerSecureChat', authenticateAccessToken, async function(req, res){
    try
    {
        var userID = req.user.id; console.log(userID);
        var publicKeyRSA = req.body.publicKeyRSA;
        var dbo = mongoUtil.getDb();
        var newPublicKey = {'publicKeyRSA': publicKeyRSA};
        var unregList = await app_helper.checkE2ERegister(userID, 000);
        if(unregList.length==1)
        {
            await dbo.collection('user').updateOne({'userID': userID},{$set:{'secureKey': newPublicKey}});
        }
        else
        {
            //xoa tin nhan cu va tao key moi
            await dbo.collection('user').updateOne({'userID': userID},{$set:{'secureKey.publicKeyRSA': publicKeyRSA}});
            socketIo.emit('secure_update_partner_publicKey',{'userID': userID, 'newPublicKey': newPublicKey});
        }

        res.send({'data': 'ok'});
    }
    catch(error)
    {
        console.log(error);
        res.send({'data':'ng', 'status':error});
    }

})
app.get('/secureChat', function(req, res){
    res.render('./views_h/secureChat');
})


//--------------Call--------------------//
app.get('/call', function(req, res){
    if(req.query.docType=='private_message')
    {
        res.render('./views_h/call',{'partnerID': req.query.partnerID, 'call':req.query.call});
    }

})
//--------------End Call----------------//

mongoUtil.connectToServer( function( err, client ) {
    if (err) console.log(err);
    // start the rest of your app here
    server.listen(8082, () => {
        console.log('Server đang chay tren cong 8082');
    });
  });
