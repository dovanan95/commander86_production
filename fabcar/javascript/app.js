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
                flag_online=1;
                online_account[i]['socketID']=socket.id;
            }
        }
        if(flag_online==0)
        {
            online_account.push({'userID':userID, 'socketID':socket.id});
        }
        
        console.log(online_account);
        socketIo.to(socket.id).emit('online_list', online_account);
        socketIo.emit('online_status', {'userID':userID, 'isOnline': true})
    })
  
    socket.on("sendRoom", function(data) {
      console.log(data);
      
      //socketIo.emit(receiver, { 'data': data, 'socket': socket.id });
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

            await contract_.submitTransaction('savePrivateMessage', data.messID,
                            data.sender, data.sender_name, data.receiver, data.message, parseInt(Date.now()));
            await contract_.submitTransaction('verifyMessBlockchain', data.messID, Date.now().toString());
                /*await contract_.submitTransaction('updateCommandHistory', 
                            data.sender.toString(), data.receiver.toString(), 'private_message');*/
            //save message to server then response to receiver
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
            socketIo.emit('online_status', {'userID':online_account[i]['userID'], 'isOnline': false})
            online_account.splice(i,1);
          }
      }
      console.log(online_account);
    });
  });


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
                    await contract_.submitTransaction('transfer_login', uid, recordSet.recordset[0].TenDayDu);
                }
                else if(recordSet.recordset.length==0)
                {
                    res.send({'result':'NG'});
                }
                
            })
        });
        /*var _contract = await contract();
        const authen = await _contract.evaluateTransaction('authentication', req.body.id, req.body.pw);
        if(await authen.toString() != 'false')
        {
            let accessToken = generateAccessToken(req.body.id);
            let refeshtoken = generateRefreshToken(req.body.id)
            res.send({'result': 'OK', 'username': authen.toString(), 'accessToken': accessToken, 'refreshToken': refeshtoken});
        }
        else if(await authen.toString() == 'false')
        {
            res.send({'result': 'NG'});
        }*/
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
        const contract_ = await contract();
        /*
        const query_private_message = {
            "selector":{
                "$or":[
                    {"sender": 'DVA', "receiver": 'LTA'},
                    {"sender": 'LTA', "receiver": 'DVA'}
                ],
                "timestamp": {"$gt": null}
            },
            "sort":[{"timestamp":"desc"}],
            "limit": 100,
            "skip":0,
            "use_index": ["_design/indexPrivMessDoc", "indexPrivMess"]
        }
        const result_6 = await contract_.evaluateTransaction('queryCustom',JSON.stringify(query_private_message));
        console.log('custom query 4:', result_6.toString());*/
        //const chat_data = await contract_.evaluateTransaction('queryMessage', 'DVA', 'LTA', 'private_message', 100, 0);
        //console.log(chat_data.toString());
        const chat_history_raw = await contract_.evaluateTransaction('queryHistoryMessage', req.body.id); console.log(chat_history_raw);
        res.send(chat_history_raw.toString());
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
        const contract_ = await contract();
        console.log({'partner_ID': req.body.partner_ID, 'my_ID': req.body.my_ID, 'limit': req.body.limit, 'skip': req.body.skip});
        const chat_data = await contract_.evaluateTransaction('queryMessage', req.body.my_ID, 
                            req.body.partner_ID, 'private_message', req.body.limit, req.body.skip);
        res.send(chat_data.toString());
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
        /*
        const query_user={
            "selector":{"userID": req.query.id, "docType":"user"}
        };
        //neccessary to check if userID exist and response true/false
        const contract_ = await contract();
        const user = await contract_.evaluateTransaction('queryCustom', JSON.stringify(query_user));
        
        if(user) //only for test, change condition when finish develop chaincode
        {
            const user_json = JSON.parse(user.toString());
            const response_data = {
                'userID': user_json[0].Record.userID,
                'name': user_json[0].Record.name,
                'Phone': user_json[0].Record.Phone,
                'certification': user_json[0].Record.certification,
                'position': user_json[0].Record.position,
                'dept': user_json[0].Record.dept,
            }
            res.send(JSON.stringify({'data': response_data}));
        }
        else if(!user)
        {
            res.send(JSON.stringify({'data': 'no_data'}));
        }*/
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
    /*var user_id = req.query.id_user;
    var user_name = req.query.username;
    res.render('./views_h/profile',
    {
        'data':JSON.stringify(
            {
                'userID': user_id, 
                'name': user_name,
                'Phone': req.query.Phone,
                'dept': req.query.dept,
                'certification': req.query.certification,
                'position': req.query.position
            }
        )
    });*/
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

app.post('/verifyMessBlockchain', async function(req, res){
    try
    {
        const contract_ = await contract();
        //var dateTime = Date.now().toString();
        console.log(req.body);
        const updated_Mess = await contract_.submitTransaction('verifyMessBlockchain', req.body.messID, req.body.dateTime);
        console.log(updated_Mess.toString());
        res.send(updated_Mess.toString());

    }
    catch(error)
    {
        console.log(error);
        res.send( {"data": "error"});
    }
})

server.listen(8082, () => {
    console.log('Server đang chay tren cong 8082');
 });