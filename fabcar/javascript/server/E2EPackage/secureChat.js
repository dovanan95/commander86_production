var mongoUtil = require( '../db' );
var multer = require('multer');
var app_helper = require('../app_helper');

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
        var myObj = await dbo.collection('user').findOne({'userID': data.ownKey});
  
            console.log(myObj.secure_chat_history.length);
            if(!myObj.secure_chat_history|| myObj.secure_chat_history.length==0) //kiem tra lich su tin nhan neu chua co gi thi them moi
            {
                if(data.ownKey==data.sender)
                {
                    let prtnObj = {'userID':data.receiver, 'docType':data.docType, 'timestamp':data.timestamp};
                    await dbo.collection('user').updateOne({'userID': data.ownKey},{$push:{'secure_chat_history':prtnObj}});
                }
                else if(data.ownKey==data.receiver)
                {
                    let prtnObj = {'userID':data.sender, 'docType':data.docType, 'timestamp':data.timestamp};
                    await dbo.collection('user').updateOne({'userID':data.ownKey},{$push:{'secure_chat_history':prtnObj}});
                }
                
            }
            else if(myObj.secure_chat_history && myObj.secure_chat_history.length>0)
            {
                //trong lich su tin nhan neu da co san thong tin thi kiem tra doi phuong dang chat da co trong danh sach chua.
                //neu co roi thi cap nhat thoi gian. neu chua co thi them moi
                if(data.ownKey==data.sender)
                {
                    let flag=0;
                    for(let j=0; j<myObj.secure_chat_history.length;j++)
                    {
                        if(myObj.secure_chat_history[j].userID==data.receiver)
                        {
                            flag=1;
                        }
                    }
                    if(flag==0)
                    {
                        let prtnObj = {'userID':data.receiver, 'docType':data.docType, 'timestamp':data.timestamp};
                        await dbo.collection('user').updateOne({'userID':data.ownKey},{$push:{'secure_chat_history':prtnObj}});
                    }
                    else if(flag==1)
                    {
                        await dbo.collection('user').updateOne({'userID':data.ownKey, 'secure_chat_history.userID':data.receiver},
                            {$set:{'secure_chat_history.$.timestamp':data.timestamp}});
                    }
                }
                else if(data.ownKey==data.receiver)
                {
                    let flag=0;
                    for(let j=0; j<myObj.secure_chat_history.length;j++)
                    {
                        if(myObj.secure_chat_history[j].userID==data.sender)
                        {
                            flag=1;
                        }
                    }
                    if(flag==0)
                    {
                        let prtnObj = {'userID':data.sender, 'docType':data.docType, 'timestamp':data.timestamp};
                        await dbo.collection('user').updateOne({'userID':data.ownKey},{$push:{'secure_chat_history':prtnObj}});
                    }
                    else if(flag==1)
                    {
                        await dbo.collection('user').updateOne({'userID':data.ownKey, 'secure_chat_history.userID':data.sender},
                            {$set:{'secure_chat_history.$.timestamp':data.timestamp}});
                    }
                }
            }
        
        await dbo.collection('user').updateOne({'userID': data.ownKey}, 
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
        var secure_privMessObj_sender = {
            'messID': data.messID,
            'docType': 'secure_private_message',
            'sender': parseInt(data.sender),
            'receiver': parseInt(data.receiver),
            //'message_to_receiver': data.message_to_receiver,
            'message_to_sender': data.message_to_sender,
            'sender_name': data.sender_name,
            'timestamp':parseInt(Date.now()),
            'isImportant': 'false',
            'seen':[],
            'ownKey': parseInt(data.sender),
        };
        var secure_privMessObj_receiver = {
            'messID': data.messID,
            'docType': 'secure_private_message',
            'sender': parseInt(data.sender),
            'receiver': parseInt(data.receiver),
            'message_to_receiver': data.message_to_receiver,
            //'message_to_sender': data.message_to_sender,
            'sender_name': data.sender_name,
            'timestamp':parseInt(Date.now()),
            'isImportant': 'false',
            'seen':[],
            'ownKey': parseInt(data.receiver),
        }
        app_helper.sendMessMultiSocket(socketIo, online_account,data.sender,'secure_incoming_mess', secure_privMessObj_sender);
        app_helper.sendMessMultiSocket(socketIo, online_account,data.receiver,'secure_incoming_mess', secure_privMessObj_receiver);
        await saveSecurePrivateMessage(secure_privMessObj_sender);
        await saveSecurePrivateMessage(secure_privMessObj_receiver);
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports={saveSecurePrivateMessage, sendSecurePrivMessIO}