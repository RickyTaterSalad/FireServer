var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    Conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    Recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    Content: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {timestamps: {createdAt: 'created_at'}});
var Message = mongoose.model('Message', MessageSchema);
module.exports = {
    Message: Message
};