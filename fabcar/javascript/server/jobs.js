var cron = require('node-cron');
var app_helper = require('./app_helper');
var mongoUtil = require('./db');


var deleteOldItem = cron.schedule('* * 1 * *', async ()=>{
    var dbo = mongoUtil.getDb();
    var currentTime = Date.now();
    var collectionList = ['privateMessage', 'groupMessage', 'secure_privateMessage'];
    collectionList.forEach(async x=>{
        var result = await dbo.collection(x).deleteMany({'isImportant': 'false', 'timestamp':{$lt: currentTime}});
    })
    
});

/*var testFunc = cron.schedule('1,10,20,30,50 * * * * *', ()=>{
    console.log('job', Date.now() );
})*/

module.exports={deleteOldItem};
