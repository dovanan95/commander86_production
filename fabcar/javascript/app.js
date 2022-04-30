var express = require('express');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('dotenv').config();

var app = express();
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var http = require("http");
const server = http.createServer(app);
const cors = require('cors');

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

var sql = require('mssql');
var mongo = require('mongodb').MongoClient;
const test = require('assert');
const { Socket } = require('socket.io');
var url_mongo = "mongodb://localhost:27017/";
var db_mongo_name = 'httcddh_2022';

var sql_config = {
    user: 'SA',
    password: 'H@yvuilennao1',
    server: '127.0.0.1', 
    database: 'httcddh2018_86_130',
    trustServerCertificate: true 
};


async function contract()
{
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

            // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
    const contract = network.getContract('fabcar');

    return contract;
}
//------------Security Zone ------------------------//

const ACCESS_TOKEN_SECRET = 'btl86_qdndvn';
const REFRESH_TOKEN_SECRET = 'httcddh_blockchain_2022';

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

//------------ End Security Zone ------------------------//

//------------ Communication Zone -----------------------//

const socketIo = require("socket.io")(server, {
   cors: {
       origin: "*",
   }
 });
//const socketIo = require("socket.io")(server);

async function queryNameUser(id){
    //query chaincode
    return("name_test");
}

async function savePrivateMessage(data)
{
    try
    {
        var db = await mongo.connect(url_mongo);
        var dbo = await db.db(db_mongo_name);
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
    }
    catch(error)
    {
        console.log(error);
    }
    finally
    {
        db.close()
    }
    
}
var users = [];
var online_account = [];

 socketIo.on("connection", (socket) => {
    console.log("New client connected ->" + socket.id);
    const ID = socket.id // id property on the socket Object
    socketIo.to(ID).emit("getId", socket.id);

    socket.on('connected', function(userID){
        users[userID]=socket.id;
        let flag_online=0;
        for(let i=0;i<online_account.length;i++)
        {
            if(online_account[i]['userID']==userID)
            {
                flag_online=1; //kiem tra trong danh sach user neu dang online nhung reload lai page hoac dang nhap o thiet bi khac thi cap nhat lai socketID
                online_account[i]['socketID']=socket.id;
            }
        }
        if(flag_online==0)
        {
            online_account.push({'userID':userID, 'socketID':socket.id}); //neu user nay chua co trong danh sach online thi them vao
        }
        
        console.log(online_account);
        socketIo.to(socket.id).emit('online_list', online_account); //gui toan bo danh sach user online cho user moi truy cap he thong
        socketIo.emit('online_status', {'userID':userID, 'isOnline': true}) // thong bao user moi online cho tat ca user khac cap nhat
    })
    socket.on('joinRoom', function(data){
        socket.join(data.roomID);
    })
  
    socket.on("sendRoom", function(data) {
      socketIo.to(data.roomID).emit('incoming_mess', data.content)
      //db.privateMessage.updateMany({'sender':{$in:[777, 783]}},{$set:{'key':'test value'}}) -> update for multi different item id
      //socketIo.to(room).emit('incoming_mess',{data})
    })
    socket.on("sendMess", async function(data){
        try
        {
            console.log(data);
            socketIo.to(users[data.receiver]).emit('incoming_mess',
                {
                    'messID': data.messID,
                    'sender': data.sender, 
                    'receiver': data.receiver, 
                    'message': data.message, 
                    'sender_name': data.sender_name,
                    'docType': 'private_message'
            });
            const contract_ = await contract();
            
            var genDate='MessPriv.' + data.sender+'.'+data.receiver+'.' + Date.now().toString();
            var privMessObj = {
                'messID': data.messID,
                'docType': 'private_message',
                'sender': data.sender,
                'receiver': parseInt(data.receiver),
                'message': data.message,
                'sender_name': data.sender_name,
                'timestamp':parseInt(Date.now()),
                'isImportant': 'false',
                'seen':[]
            }
            await savePrivateMessage(privMessObj);
            /*await contract_.submitTransaction('savePrivateMessage', data.messID,
                            data.sender, data.sender_name, data.receiver, data.message, parseInt(Date.now()));
            await contract_.submitTransaction('verifyMessBlockchain', data.messID, Date.now().toString());*/
        }
        catch(error)
        {
            console.log(error);
        }
       
    })
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:" + socket.id);
      for(let i=0;i<online_account.length;i++)
      {
          if(online_account[i]['socketID']==socket.id)
          {
            socketIo.emit('online_status', {'userID':online_account[i]['userID'], 'isOnline': false}) //thong bao user da offline cho cac user khac cap nhat
            online_account.splice(i,1); //xoa thong tin user offfline khoi danh sach online
          }
      }
      console.log(online_account);
    });
  });


//------------ End Communication Zone -----------------------//

app.set('view engine', 'ejs');
app.set('views', __dirname);
 
app.use(upload.array()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + '/views_h'));

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
        /*const contract_ = await contract();
        const chat_history_raw = await contract_.evaluateTransaction('queryHistoryMessage', req.body.id); console.log(chat_history_raw);
        res.send(chat_history_raw.toString());*/

        var db = await mongo.connect(url_mongo);
        var dbo = await db.db(db_mongo_name);
        var list_chat = await dbo.collection('user').findOne({'userID': req.body.id});
        var queryString_nameuser = 'select id, TenDayDu from DoIT_CanBo where id in (';
        for(let i = 0; i<list_chat.chat_history.length; i++)
        {
            queryString_nameuser = queryString_nameuser + "'"+ list_chat.chat_history[i].userID + "'"+",";
        }
        queryString_nameuser=queryString_nameuser+ "1)";
        sql.connect(sql_config, function(err){
            if(err){
                console.log(err);
                res.send({'result':'connect to database failed!'})
            }
            var request = new sql.Request();
            request.query(queryString_nameuser, function(err,recordSet){
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
        //db.privateMessage.find({$or:[{'sender':777,'receiver':783},{'sender':783,'receiver':777}]}).sort({'timestamp':-1}).limit(100)
        /*const contract_ = await contract();
        console.log({'partner_ID': req.body.partner_ID, 'my_ID': req.body.my_ID, 'limit': req.body.limit, 'skip': req.body.skip});
        const chat_data = await contract_.evaluateTransaction('queryMessage', req.body.my_ID, 
                            req.body.partner_ID, 'private_message', req.body.limit, req.body.skip);
        res.send(chat_data.toString());*/

        var db = await mongo.connect(url_mongo);
        var dbo = await db.db(db_mongo_name);
        var chatBlocks = await dbo.collection('privateMessage').find({$or:[{'sender':req.body.my_ID,'receiver':req.body.partner_ID},
        {'sender':req.body.partner_ID,'receiver':req.body.my_ID}]}).sort({'timestamp':-1}).limit(req.body.limit).toArray();
        res.send(JSON.stringify(chatBlocks))

    }
    catch(error)
    {
        console.log(error);
    }
})


//for chat room (dev in future)
app.post('/chat_room', function(req, res){
    console.log({'room_ID': req.body.room_ID, 'docType':req.body.type});
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
    const contract_ = await contract();
    var db = await mongo.connect(url_mongo);
    var dbo = await db.db(db_mongo_name);
    var chatBlock = await dbo.collection('privateMessage').findOne({'messID': req.body.messID});

    await contract_.submitTransaction('savePrivateMessage', req.body.messID,
                            chatBlock.sender, chatBlock.sender_name, chatBlock.receiver, chatBlock.message, chatBlock.timestamp);
    var resporn = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, Date.now().toString());
    if(JSON.parse(resporn.toString()).messID)
    {
        console.log(JSON.parse(resporn.toString()).messID);
        if(chatBlock.docType =='private_message')
        {
            await dbo.collection('privateMessage').updateOne({'messID': req.body.messID},{$set:{'isImportant': 'true'}})
            res.send({'data':'ok'});
        }
        
    }
    else if(!JSON.parse(resporn.toString()).messID)
    {
        res.send({'data':'error'});
    }
    
})

app.post('/verifyMessBlockchain', authenticateAccessToken, async function(req, res){
    try
    {
        const contract_ = await contract();
        var db = await mongo.connect(url_mongo);
        var dbo = await db.db(db_mongo_name);
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
                'seen':[],
                'docType': update_Mess_json.docType
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
})

server.listen(8082, () => {
    console.log('Server đang chay tren cong 8082');
 });