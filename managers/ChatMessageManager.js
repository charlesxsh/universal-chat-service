/**
 * Created by Shihao on 1/27/17.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Chat = require('./../models/chat');

function ChatMessageManager(mongodbUrl){
    mongoose.connect(mongodbUrl);
}

ChatMessageManager.prototype.handleError = function(err){
    console.error(err);
};

ChatMessageManager.prototype.saveReadChat = function(from, to, content){
    console.log('save read chat from'+ from);
    const newChat = new Chat({from:from, to:to, content:content, is_read:true});
    newChat.save().then((ret)=>{
       console.log(ret);
    });
};

ChatMessageManager.prototype.saveUnreadChat = function(from, to, content){
    console.log('save unread chat from'+ from);
    const newChat = new Chat({from:from, to:to, content:content, is_read:false});
    newChat.save().then((ret)=>{
        console.log(ret);
    });
};

/**
 * Get unread message that send to uid when uid is not online
 * @param uid
 * @return promise
 */
ChatMessageManager.prototype.getUnreadChatByUid = function(uid) {
    let query = Chat.find({ 'to': uid, 'is_read':false});
    return query.exec();
};

module.exports = ChatMessageManager;
