var mongoose = require("mongoose");

var ConversationSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    archived:{
        type: mongoose.Schema.Types.Boolean,
        default: false,
        required: true,
        index: true
    },
    messages: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
    ]
}, {timestamps: true});


ConversationSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {
            id: ret._id,
            creator: ret.creator,
            recipient: ret.recipient,
            post: ret.post,
            messages: ret.messages
        };
    }
});
var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = {
    Conversation: Conversation
};