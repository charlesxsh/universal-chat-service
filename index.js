/**
 * Created by Shihao on 1/25/17.
 */

/**
 * Initialize socket.io
 */
const io = require('socket.io')(process.env.PORT || 8080);
const socketredis = require('socket.io-redis');
io.adapter(socketredis(process.env.REDIS_URL));

/**
 * Initialize UserStatusManager
 */
const UserStatusManager = require('./UserStatusManager');
const redis = require('redis');
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
//6380,'<name>.redis.cache.windows.net', {auth_pass: '<key>', tls: {servername: '<name>.redis.cache.windows.net'}}
const userStatusClient = redis.createClient(process.env.REDIS_URL);
const userManager = new UserStatusManager(userStatusClient);

/**
 * Initialize ChatHistoryManager
 */
const ChatHistoryManager = require('./ChatHistoryManager');
const historyManager = new ChatHistoryManager('mongodb://xsh:xshxsh@ds133249.mlab.com:33249/heroku_7fcng7wk');

io.on('connection', (socket)=>{
    console.log("new connection: "+socket.id);


    //chatmessage
    //tuid:string, content:json
    socket.on('cmsg', (msg)=>{
        if(socket.uid == undefined){
            console.log("user havn't login");
            return;
        }
        console.log('To:'+msg.tuid);
        console.log('From:'+socket.uid);
        console.log('Content:'+msg.content);

        socket.broadcast.to(msg.tuid).emit('cmsg', {fuid:socket.uid, content:msg.content});
        historyManager.saveChat(socket.uid, msg.tuid, msg.content);
    });

    //login
    //uid:string
    socket.on('login', (msg, ack)=>{
        socket.uid = msg.uid;
        socket.join(msg.uid);
        socket.leave(socket.id);
        userManager.userLogin(socket.uid, socket.id).then((ret)=>{
            console.log('user login return:'+ret);
            console.log(socket.rooms);
            if(ack != null && ack != undefined){
                ack({result:ret});
            }
        });


    });

    socket.on('disconnect',()=>{
        userManager.userLogoff(socket.uid);
    });

    //uid:String
    socket.on('if_user_online',(msg, ack)=>{
        userManager.isUserOnline(msg.uid).then((ret)=>{
           if(ret === 1){
               ack({result:true});
           } else {
               ack({result: false});
           }
        });
    });
});

