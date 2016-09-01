var Message = require('mongoose').model('Message');
const RequestHelperMethods = require("../util/request-helper-methods");
var conversationController = require("../controllers/conversation-controller");
var postController = require("../controllers/post-controller");
var debug = require('debug')('fireServer:server');


var isPartOfConversation = function (req, res, next) {
    if (!req || !req.params || !req.params.conversationId || !RequestHelperMethods.validObjectId((req.params.conversationId ))) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    else {
        conversationController.findById(req.params.conversationId).then(function (conversation) {
            if (!conversation) {
                return res.json({success: false, message: "User is not part of conversation"});
            }
            else {
                postController.findById(conversation.post).then(function (post) {
                    if (post.creator == req.locals.userId || conversation.creator == req.locals.userId) {
                        return res.json({success: false, message: "User is not part of conversation"});
                    }
                    else{
                        next();
                    }
                })
            }
        })
    }
};

var create = function (req, res, next) {
    if (!req.body.message || !RequestHelperMethods.validObjectId((req.body.message.conversation))) {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
    conversationController.findById(req.body.message.conversation).then(function (conversation) {
        console.dir(arguments);
        if (!conversation) {
            return res.json({success: false, message: "Conversation does not exist"});
        }
        postController.findById(conversation.post).then(function (post) {
            if (!post) {
                return res.json({success: false, message: "Post does not exist"});
            }
            if (post.creator == req.locals.userId || conversation.creator == req.locals.userId) {
                return res.json({success: false, message: "User is not part of conversation"});
            }
            var otherPersonId = post.creator != req.locals.userId ? conversation.creator : post.creator;
            debug("other person: " + otherPersonId);
            var message = new Message({
                sender: req.locals.userId,
                recipient: otherPersonId,
                content: req.body.message.content,
                conversation: req.body.message.conversation
            });
            var error = message.validateSync();
            if (error) {
                res.json(RequestHelperMethods.invalidRequestJson);
            }
            else {
                if (!req.locals) {
                    req.locals = {};
                }
                req.locals.message = message;
                next();
            }
        })
    });
};

module.exports = {
    create: create,
    isPartOfConversation: isPartOfConversation
};