/**
 * Created by Shihao on 1/26/17.
 */
const mongoose = require('mongoose');

let chatSchema = new mongoose.Schema({
    from:String,
    to:String,
    content:String,
    is_read:Boolean,
    created_at:{ type: Date, default: new Date()},
});

module.exports = mongoose.model('Chat', chatSchema,'chats');
