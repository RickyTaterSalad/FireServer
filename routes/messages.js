var router = require('express').Router();
var messageController = require("../controllers/message-controller");
var conversationController = require("../controllers/conversation-controller");
const hasUser = require("../validators/has-user-validator").validate;
var messageValidator = require("../validators/message-validator");

router.get('/:conversationId', hasUser, messageValidator.isPartOfConversation, function (req, res) {
    if (req.params.conversationId) {
        messageController.forConversation(req.params.conversationId).then(function (messages) {
            return res.json(messages || []);
        });
    }
    else {
        return res.status(400).send();
    }
});
router.post('/', hasUser, messageValidator.create, function (req, res) {
    if (!req.locals || !req.locals.message) {
        return res.status(400).send();
    }
    req.locals.message.save(function (err) {
        if (err) {
            return res.status(400).send();
        }
        else {
            conversationController.addMessageToConversation(req.locals.message).then(function () {
                return res.json(req.locals.message);
            });
        }
    });
});
module.exports = router;
