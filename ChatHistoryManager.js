/**
 * Created by Shihao on 1/27/17.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Chat = require('./models/chat');

function ChatHistoryManager(mongodbUrl){
    mongoose.connect(mongodbUrl);
}

ChatHistoryManager.prototype.saveChat = function(from, to, content){
    const newChat = new Chat({from:from, to:to, content:content});
    newChat.save().then((ret)=>{
       console.log(ret);
    });
};

module.exports = ChatHistoryManager;
