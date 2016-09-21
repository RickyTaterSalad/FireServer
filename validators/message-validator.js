var Message = require('mongoose').model('Message');
const RequestHelperMethods = require("../util/request-helper-methods");
var conversationController = require("../controllers/conversation-controller");
var postController = require("../controllers/post-controller");
var debug = require('debug')('fireServer:server');


var isPartOfConversation = function (req, res, next) {
    if (!req || !req.params || !req.params.conversation || !req.params.conversation.id) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    else {
        conversationController.findById(req.params.conversation.id).then(function (conversation) {
            if (!conversation) {
                return res.json({success: false, message: "User is not part of conversation"});
            }
            else {
                postController.findById(conversation.post).then(function (post) {
                    if (post.creator == req.locals.userId || conversation.creator == req.locals.userId) {
                        return res.json({success: false, message: "User is not part of conversation"});
                    }
                    else {
                        next();
                    }
                })
            }
        })
    }
};
var create = function (req, res, next) {
    if (!req.body.content || !req.body.conversation || !req.body.conversation.id) {
        return res.status(400).send();
    }
    conversationController.findById(req.body.conversation.id).then(function (conversation) {
        if (!conversation) {
            return res.status(400).send("Conversation Does Not Exist");
        }
        postController.findById(conversation.post).then(function (post) {
            if (!post) {
                return res.status(400).send("Post does not exist");
            }
            if (post.creator != req.locals.userId && conversation.creator != req.locals.userId) {
                return res.status(400).send("You Are Not Part Of The Conversation");
            }
            var otherPersonId = post.creator != req.locals.userId ? conversation.creator : post.creator;
            var message = new Message({
                sender: req.locals.userId,
                recipient: otherPersonId,
                content: req.body.content,
                conversation: req.body.conversation.id
            });
            var error = message.validateSync();
            if (error) {
                return res.status(400).send("Could Not Create Message");
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