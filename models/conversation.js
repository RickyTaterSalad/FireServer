var mongoose = require("mongoose");

var ConversationSchema = new mongoose.Schema({
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    Recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    Post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    MessageIds: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
    ]
}, {timestamps: true});
var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = {
    Conversation: Conversation
};