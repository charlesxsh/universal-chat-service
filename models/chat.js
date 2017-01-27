/**
 * Created by Shihao on 1/26/17.
 */
const mongoose = require('mongoose');

let chatSchema = new mongoose.Schema({
    from:String,
    to:String,
    content:String,
    created_at:{ type: Date, default: new Date()},
}, { collection: 'chats'});

let chat = mongoose.model('Chat', chatSchema);

module.exports = chat;