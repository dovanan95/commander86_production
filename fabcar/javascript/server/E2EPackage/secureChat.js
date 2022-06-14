var mongoUtil = require( '../db' );
var multer = require('multer');
var app_helper = require('../app_helper');

async function saveSecurePrivateMessage(data)
{
    try
    {
        var dbo = mongoUtil.getDb();
        /*var secure_privMessObj_sender = {
            'messID': data.messID+'ownKey.'+data.sender,
            'docType': 'secure_private_message',
            'sender': parseInt(data.sender),
            'receiver': parseInt(data.receiver),
            //'message_to_receiver': data.message_to_receiver,
            'message': data.message_to_sender,
            'sender_name': data.sender_name,
            'timestamp':parseInt(Date.now()),
            'isImportant': 'false',
            'seen':[],
            'ownKey': parseInt(data.sender),
        };

        var secure_privMessObj_receiver = {
            'messID': data.messID+'ownKey.'+data.receiver,
            'docType': 'secure_private_message',
            'sender': parseInt(data.sender),
            'receiver': parseInt(data.receiver),
            'message': data.message_to_receiver,
            //'message_to_sender': data.message_to_sender,
            'sender_name': data.sender_name,
            'timestamp':parseInt(Date.now()),
            'isImportant': 'false',
            'seen':[],
            'ownKey': parseInt(data.receiver),
        }*/
        
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

module.exports={saveSecurePrivateMessage, sendSecurePrivMessIO}