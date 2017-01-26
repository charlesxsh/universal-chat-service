/**
 * Created by Shihao on 1/25/17.
 */

const io = require('socket.io')(process.env.PORT || 8080);
const redis = require('socket.io-redis');

io.adapter(redis({ host: 'h:pc2cc4d1c98d1f98b24509cbe755f97a5f0610a23e33e9bcc77dc583dd18b2fe1@ec2-54-225-230-45.compute-1.amazonaws.com', port: 26339 }));

io.on('connection', (socket)=>{
    console.log("Login: "+socket.id);

    //chatmessage
    //to:string, content:json
    socket.on('cmsg', (msg)=>{
        socket.broadcast.to(msg.to).emit('cmsg', {from:socket.id, content:msg.content});
    });

    //login
    socket.on('login', (msg)=>{
        socket.emit("chatid", {chatid:socket.id});
    });

    socket.on('disconnect',()=>{
       console.log("Logoff: "+socket.id);
    });
});


