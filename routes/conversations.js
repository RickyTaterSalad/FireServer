var router = require('express').Router();
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
const validateConversation = require("../validators/conversation-validator").validate;

router.get('/', hasUser,function (req, res) {
    Conversation.find({
        $or: [{'creator': req.locals.userId}, {'recipient': req.locals.userId}]
    }).populate('Messages').exec(function (err, conversations) {
        if (err) {
            res.send(err);
        } else {
            res.json(conversations);
        }
    });
});
router.post('/', hasUser, validateConversation, function (req, res) {
    req.locals.conversation.save(function (err) {
        return err ? res.json(RequestHelperMethods.invalidRequestJson) : res.json(req.locals.conversation);
    });
});
module.exports = router;