var router = require('express').Router();
var messageController = require("../controllers/message-controller");
var conversationController = require("../controllers/conversation-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
var messageValidator = require("../validators/message-validator");

router.get('/:conversationId', hasUser, messageValidator.isPartOfConversation, function (req, res) {
    if (req.params.conversationId) {
        messageController.forConversation(req.params.conversationId).then(function (messages) {
            return res.json(messages || []);
        });
    }
    else {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
});
router.post('/', hasUser, messageValidator.create, function (req, res) {
    req.locals.message.save(function (err) {
        if (err) {
            return res.json(RequestHelperMethods.invalidRequestJson);
        }
        else {
            conversationController.addMessageToConversation(req.locals.message).then(function () {
                return res.json(req.locals.message);
            });
        }
    });
});
module.exports = router;