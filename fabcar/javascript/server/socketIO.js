const app_helper = require('./app_helper');
const secureChat = require('./E2EPackage/secureChat');
var jwt = require('jsonwebtoken');
var mongoUtil = require( './db' );

const ACCESS_TOKEN_SECRET = app_helper.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = app_helper.REFRESH_TOKEN_SECRET;

var users = {};
var users_call={};
var online_account = [];
var sockets = [];

function socketCommunication(socketIo){

    socketIo.use((socket, next)=>{
        if(socket.handshake.auth && socket.handshake.auth.token)
        {
            var token = socket.handshake.auth.token; console.log(token);
            jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user)=>{
                if(error){
                    res.sendStatus(403);
                }
                socket.user = user;
                next();
            })
        }
        else
        {
            socket.disconnect();
        }
    })
    socketIo.on("connection", (socket) => {
        console.log("New client connected ->" + socket.id);
        const ID = socket.id // id property on the socket Object
        socketIo.to(ID).emit("getId", socket.id);
        sockets.push(socket);
        socket.on('connected', function(data){
            users[data.userID]=socket.id;
            console.log('user', users);
            let flag_online=0;
            for(let i=0;i<online_account.length;i++)
            {
                if(online_account[i]['userID']==data.userID)
                {
                    flag_online=1; //kiem tra ton tai trong danh sach user online
                    //online_account[i]['socketID']=socket.id;
                }
            }
            if(flag_online==0)
            {   
                //socketIo.to(socket.id).emit('online_list', online_account); //gui toan bo danh sach user online cho user moi truy cap he thong
                socketIo.emit('online_status', {'userID':data.userID, 'isOnline': true, 'socketID':socket.id}) // thong bao user moi online cho tat ca user khac cap nhat
            }
            online_account.push({'userID':data.userID, 'socketID':socket.id}); 
            console.log(online_account);
            app_helper.sendMessMultiSocket(socketIo,online_account,data.userID,'online_list', online_account);
            
        })
        socket.on('joinRoom', function(data){
            socket.join(data.roomID);
        })
        socket.on('leaveRoom', function(data){
            socket.leave(data.roomID);
        })
    
        socket.on("sendRoom", async function(data) {
        //db.privateMessage.updateMany({'sender':{$in:[777, 783]}},{$set:{'key':'test value'}}) -> update for multi different item id
        //socketIo.to(room).emit('incoming_mess',{data})
        try
        {
            socketIo.in(data.groupID).emit('incoming_mess', 
            {
                'messID': data.messID,
                'sender': data.sender, 
                'groupID': data.groupID, 
                'groupName': data.groupName,
                'message': data.message, 
                'sender_name': data.sender_name,
                'docType': 'group_message'
            })
            var groupMessObj = {
                'messID': data.messID,
                'docType': 'group_message',
                'sender': data.sender,
                'groupID': data.groupID,
                'message': data.message,
                'sender_name': data.sender_name,
                'timestamp':parseInt(Date.now()),
                'isImportant': 'false',
                'seen':[]
            }
            await app_helper.saveGroupMessage(groupMessObj);
        }
        catch(error)
        {
            console.log(error);
        }
        })
        socket.on("sendMess", async function(data){
            try
            {

                console.log(data);
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

                app_helper.sendMessMultiSocket(socketIo, online_account,data.receiver, 'incoming_mess', privMessObj);
                app_helper.sendMessMultiSocket(socketIo, online_account,data.sender, 'incoming_mess', privMessObj);
                await app_helper.savePrivateMessage(privMessObj);

            }
            catch(error)
            {
                console.log(error);
            }
        
        })

        socket.on('secure_sendMess', async function(data){
            await secureChat.sendSecurePrivMessIO(data, socketIo, online_account);
        })

        socket.on('seenUpdate', async function(data){
            try
            {
                console.log(data);
                var dbo = mongoUtil.getDb();
                if(data.docType=='private_message')
                {
                    await dbo.collection('privateMessage').updateOne({'messID':data.messID},
                    {$push:{'seen':{'userID': data.userID,'timestamp': data.timestamp}}});

                }
                else if(data.docType=='group_message')
                {
                    await dbo.collection('groupMessage').updateOne({'messID':data.messID},
                    {$push:{'seen':{'userID': data.userID,'timestamp': data.timestamp}}});
                }
            }
            catch(error)
            {
                console.log(error);
            }
        })
        socket.on('call_connect', function(data){
            users_call[data.userID]=socket.id;
        })
        socket.on('call', (data) => {
            let callee = data.calleeID; 
            let rtcMessage = data.rtcMessage;
            console.log('user_call', users_call);
            socket.to(users[callee]).emit("newCall", {
                caller: data.caller,
                rtcMessage: rtcMessage,
                callerID: data.callerID
            })

        })

        socket.on('answerCall', (data) => {
            let callerID = data.callerID;
            rtcMessage = data.rtcMessage;
            console.log('answerCall', users_call, users_call[callerID]);

            socket.to(users_call[callerID]).emit("callAnswered", {
                rtcMessage: rtcMessage
            })

        })

        socket.on('ICEcandidate', (data) => {
            let otherUser = data.user;
            let rtcMessage = data.rtcMessage;

            socket.to(users_call[otherUser]).emit("ICEcandidate", {
                sender: data.sender,
                rtcMessage: rtcMessage
            })
        })
    
        socket.on("disconnect", () => {
        console.log("Client disconnected:" + socket.id);
        let flag_online=0;
        let live_user;

        for(let i=0;i<online_account.length;i++){
            if(online_account[i]['socketID']==socket.id){
                live_user=online_account[i]['userID'];
                online_account.splice(i,1);
            }
        }
        for(let j=0;j<online_account.length;j++){
            if(online_account[j]['userID']==live_user){
                flag_online=1;
            }
        }
        if(flag_online==0){
            socketIo.emit('online_status', {'userID':live_user, 'isOnline': false}) //thong bao user da offline cho cac user khac cap nhat
        }
        console.log(online_account);
        });
    });


}

module.exports={socketCommunication, users, online_account, users_call, sockets}