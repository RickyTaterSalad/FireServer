var mongoose = require("mongoose");

var ConversationSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    messages: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
    ]
}, {timestamps: true});
var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = {
    Conversation: Conversation
};