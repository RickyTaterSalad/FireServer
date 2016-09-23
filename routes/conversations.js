var router = require('express').Router();
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
const hasUser = require("../validators/has-user-validator").validate;
const validateConversation = require("../validators/conversation-validator").validate;
var conversationController = require("../controllers/conversation-controller");

var debug = require('debug')('fireServer:server');

router.get('/:postId', hasUser, function (req, res) {
    conversationController.findByUserAndPostId(req.user.id, req.params.postId).then(function (conversations) {
        return res.json(conversations || []);
    });
});
router.post('/', hasUser, validateConversation, function (req, res) {
    if (req.locals && req.locals.conversation) {
        conversationController.create(req.locals.conversation).then(function () {
            return res.json(req.locals.conversation);
        });
        req.locals.conversation.save(function (err) {

        });
    }
    else {
        return res.status(400).send();
    }

});
module.exports = router;