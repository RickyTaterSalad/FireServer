var router = require('express').Router();
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');

//list all - todo filter by user id in middleware
router.get('/', function (req, res) {
    if (req.user != null) {
        console.log("user logged in: " + req.user._id);
        Conversation.find({
            $or: [{'creator': req.user._id}, {'recipient': req.user._id}]
        }).populate('Messages').exec(function (err, conversations) {
            if (err) {
                res.send(err);
            } else {
                res.json(conversations);
            }
        });

    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});

router.post('/', function (req, res) {
    if (req.user) {
        var conversation = JSON.parse(JSON.stringify(req.body));
        conversation.creator = req.user._id;
        //debug
        console.log("creating conversation: " + JSON.stringify(conversation));
        Conversation.create(conversation, function (err, conversation) {
            if (err) {
                res.send(err);
            } else {
                res.json(conversation);
            }
        });
    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});
module.exports = router;