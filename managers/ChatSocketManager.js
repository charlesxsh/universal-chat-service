/**
 * Created by Shihao on 1/27/17.
 */
const chatSocketEvent = require('./../ChatSocketEvent');

function ChatSocketManager(chatMessageManager, userStatusManager) {
    this.chatMessageManager = chatMessageManager;
    this.userStatusManager = userStatusManager;
}

ChatSocketManager.prototype.init = function (socket){
    //chatmessage
    //tuid:string, content:json
    socket.on(chatSocketEvent.chat, (msg)=>{
        if(socket.uid == undefined){
            console.log("user havn't login");
            return;
        }
        console.log('To:'+msg.tuid);
        console.log('From:'+socket.uid);
        console.log('Content:'+msg.content);

        this.userStatusManager.isUserOnline(msg.tuid).then((ret)=>{
            if(ret === 1){
                socket.broadcast.to(msg.tuid).emit('cmsg', {fuid:socket.uid, content:msg.content});
                this.chatMessageManager.saveReadChat(socket.uid, msg.tuid, msg.content);
            } else {
                this.chatMessageManager.saveUnreadChat(socket.uid, msg.tuid, msg.content);
            }
        });
    });

    //uid:string
    socket.on(chatSocketEvent.login, (msg, ack)=>{
        socket.uid = msg.uid;
        socket.join(msg.uid);
        socket.leave(socket.id);
        this.userStatusManager.userLogin(socket.uid, socket.id).then((ret)=>{
            console.log('user login return:'+ret);
            console.log(socket.rooms);
            if(ack != null && ack != undefined){
                ack({result:ret});
            }
        });


    });

    socket.on('disconnect',()=>{
        this.userStatusManager.userLogoff(socket.uid);
    });

    //uid:String
    socket.on(chatSocketEvent.ifUserLogin,(msg, ack)=>{
        this.userStatusManager.isUserOnline(msg.uid).then((ret)=>{
            if(ret === 1){
                ack({result:true});
            } else {
                ack({result: false});
            }
        });
    });


    socket.on(chatSocketEvent.unreadChat, (msg, ack)=>{
        if(typeof socket.uid != 'string'){
            console.log('User havn\'t login, not allowd to get unread message');
            return;
        }
        console.log('get unread chat from '+socket.uid);
        this.chatMessageManager.getUnreadChatByUid(socket.uid).then((ret)=>{
            console.log(ret);
            if(typeof ack == 'function') {
                ack({
                    err: err,
                    results: ret
                })
            }
        }).catch((err)=>{
            console.error(err);
            if(typeof ack == 'function') {
                ack({err:err})
            }

        });
    });
};

module.exports = ChatSocketManager;
