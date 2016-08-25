var Message = require('mongoose').model('Message');
const RequestHelperMethods = require("../util/request-helper-methods");
var validate = function (req,res,next) {
    var message = new Message({
        sender: req.locals.userId,
        recipient: req.body.recipient,
        content: req.body.content,
        conversation: req.body.conversation
    });
    var error = message.validateSync();
    if (error) {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
    else {
        if(!req.locals){
            req.locals = {};
        }
        req.locals.message = message;
        next();
    }
};

module.exports = {
    validate: validate
};