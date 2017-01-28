/**
 * Created by Shihao on 1/25/17.
 */

/**
 * Manager Type
 */
const ChatSocketManager = require('./managers/ChatSocketManager');
const ChatMessageManager = require('./managers/ChatMessageManager');
const UserStatusManager = require('./managers/UserStatusManager');

/**
 * Initialize socket.io
 */
const io = require('socket.io')(process.env.PORT || 8080);
const socketredis = require('socket.io-redis');
io.adapter(socketredis('redis://:zMfd7FFRuz0Lf0m5D0OELqy5OSO7UN8G2VPDbPDZEG0=@xshredis.redis.cache.windows.net:6379'));

/**
 * Initialize UserStatusManager
 */
const redis = require('redis');
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);

//process.env.REDIS_URL
//6380,'xshredis.redis.cache.windows.net', {auth_pass: 'zMfd7FFRuz0Lf0m5D0OELqy5OSO7UN8G2VPDbPDZEG0=', tls: {servername: 'xshredis.redis.cache.windows.net'}}
const userStatusClient = redis.createClient(6380,'xshredis.redis.cache.windows.net', {auth_pass: 'zMfd7FFRuz0Lf0m5D0OELqy5OSO7UN8G2VPDbPDZEG0=', tls: {servername: 'xshredis.redis.cache.windows.net'}});
const userStatusManager = new UserStatusManager(userStatusClient);

/**
 * Initialize ChatMessageManager
 */
const chatMessageManager = new ChatMessageManager('mongodb://xsh:xshxsh@ds133249.mlab.com:33249/heroku_7fcng7wk');

/**
 * Initialize ChatSocketManager
 */
const chatSocketManager = new ChatSocketManager(chatMessageManager, userStatusManager);

io.on('connection', (socket)=>{
    console.log("new connection: "+socket.id);
    chatSocketManager.init(socket);
});

