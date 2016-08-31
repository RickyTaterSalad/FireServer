var Conversation = require('mongoose').model('Conversation');
var Message = require('mongoose').model('Message');
var postController = require("../controllers/post-controller");
var conversationController = require("../controllers/conversation-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
var debug = require('debug')('fireServer:server');

//must have a message to create a conversation

var validate = function (req, res, next) {
    if (!req.body.conversation || !RequestHelperMethods.validObjectId(req.body.conversation.post) ) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    conversationController.conversationExistsForUserAndPost(req.locals.userId,req.body.conversation.post).then(function(exists){
        if(exists){
            return res.json({success: false, message: "Conversation already exists for post."});
        }
        postController.findById(req.body.conversation.post).then(function(post){
            if(post == null){
                return res.json({success: false, message: "Cannot locate post to create conversation for."});
            }
            if(post.creator == req.locals.userId){
                return res.json({success: false, message: "Cannot create a conversation with yourself."});
            }
            var conversation = new Conversation({
                creator: req.locals.userId,
                post: req.body.conversation.post
            });
            var error = conversation.validateSync();
            if (error) {
                return res.json(RequestHelperMethods.invalidRequestJson);
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