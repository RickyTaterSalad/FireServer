var router = require('express').Router();
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
const validateConversation = require("../validators/conversation-validator").validate;

var debug = require('debug')('fireServer:server');

router.get('/', hasUser, function (req, res) {
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
    if (req.locals && req.locals.conversation) {
        req.locals.conversation.save(function (err) {
            if(err){
                debug("could not save post");
                return res.json(RequestHelperMethods.invalidRequestJson);
            }
            else {
                return res.json(req.locals.conversation);
            }
        });
    }
    else {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }

});
module.exports = router;