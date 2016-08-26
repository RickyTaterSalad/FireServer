var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true

    },
    sender: {
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
    content: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {timestamps: {createdAt: 'created_at'}});

MessageSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {
            id: ret._id,
            conversation: ret.conversation,
            sender: ret.sender,
            recipient: ret.recipient,
            content: ret.content
        };
    }
});


var Message = mongoose.model('Message', MessageSchema);
module.exports = {
    Message: Message
};