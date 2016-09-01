var router = require('express').Router();
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
const validateConversation = require("../validators/conversation-validator").validate;
var conversationController = require("../controllers/conversation-controller");

var debug = require('debug')('fireServer:server');

router.get('/', hasUser, function (req, res) {
    conversationController.findByUser(req.user).then(function (conversations) {
        return res.json(conversations || []);
    });
});
router.post('/', hasUser, validateConversation, function (req, res) {
    if (req.locals && req.locals.conversation) {
        req.locals.conversation.save(function (err) {
            if (err) {
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