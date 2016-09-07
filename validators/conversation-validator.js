var Conversation = require('mongoose').model('Conversation');
var Message = require('mongoose').model('Message');
var postController = require("../controllers/post-controller");
var conversationController = require("../controllers/conversation-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
var debug = require('debug')('fireServer:server');

//must have a message to create a conversation

var validate = function (req, res, next) {
    if (!req.body.conversation || !req.body.conversation.post || !req.body.conversation.post.id) {
        return res.status(400).send("Bad Request");
    }
    conversationController.conversationExistsForUserAndPost(req.locals.userId, req.body.conversation.post.id).then(function (exists) {
        if (exists) {
            return res.status(400).send("Conversation already exists for post.");
        }
        postController.findById(req.body.conversation.post.id).then(function (post) {
            if (post == null) {
                return res.status(400).send("Cannot locate post to create conversation for.");
            }
            if (post.creator == req.locals.userId) {
                return res.status(400).send("Cannot create a conversation with yourself.");
            }
            var conversation = new Conversation({
                creator: req.locals.userId,
                post: req.body.conversation.post.id,
                recipient: post.creator
            });
            var error = conversation.validateSync();
            if (error) {
                return res.status(400).send("Bad Request")
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