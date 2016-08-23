var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    Conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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