var Conversation = require('mongoose').model('Conversation');
const RequestHelperMethods = require("../util/request-helper-methods");

var validate = function (req, res, next) {
    var conversation = new Conversation({
        creator: req.locals.userId,
        recipient: req.body.recipient,
        post: req.body.post
    });
    var error = conversation.validateSync();
    if (error) {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
    else {
        if(!req.locals){
            req.locals = {};
        }
        req.locals.conversation = conversation;
        next();
    }
};
module.exports = {
    validate: validate
};