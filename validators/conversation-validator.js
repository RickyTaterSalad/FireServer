var Conversation = require('mongoose').model('Conversation');
var Message = require('mongoose').model('Message');
var postController = require("../controllers/post-controller");
var conversationController = require("../controllers/conversation-controller");
var debug = require('debug')('fireServer:server');

//must have a message to create a conversation

var validate = function (req, res, next) {
    if (!req.body.conversation || !req.body.conversation.post || !req.body.conversation.post.id) {
        return res.status(400).send();
    }
    conversationController.conversationExistsForUserAndPost(req.locals.userId, req.body.conversation.post.id).then(function (exists) {
        if (exists) {
            return res.status(400).send("Conversation Exists For Post");
        }
        postController.findById(req.body.conversation.post.id).then(function (post) {
            if (post == null) {
                return res.status(400).send("Cannot Locate Post");
            }
            if (post.creator == req.locals.userId) {
                return res.status(400).send("Cannot Create A Conversation With Yourself");
            }
            var conversation = new Conversation({
                creator: req.locals.userId,
                post: req.body.conversation.post.id,
                recipient: post.creator
            });
            var error = conversation.validateSync();
            if (error) {
                return res.status(400).send()
            }
            else {
                if (!req.locals) {
                    req.locals = {};
                }
                req.locals.conversation = conversation;
                return next();
            }
        });
    });
};
module.exports = {
    validate: validate
};