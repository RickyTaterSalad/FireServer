var router = require('express').Router();
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');

//list all - todo filter by user id in middleware
router.get('/', function (req, res) {
    Conversation.find(function (err, conversations) {
        if (err) {
            res.send(err);
        } else {
            res.json(conversations);
        }
    });
});
//conversations for user - todo make sure id is correct in middleware
router.get('/user/:id', function (req, res) {
    if (req.params.id) {
        Conversation.find({'Creator._id': req.params.id}, function (err, conversations) {
            if (err) {
                res.send(err);
            } else {
                res.json(conversations);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});
//conversation by id - todo using middleware make sure user is part of conversation

router.get('/:id', function (req, res) {
    if (req.params.id) {
        Conversation.findById(req.params.id, function (err, conversations) {
            if (err) {
                res.send(err);
            } else {
                res.json(conversations);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});

router.post('/', function (req, res) {
    Conversation.create(req.body, function (err, conversation) {
        if (err) {
            res.send(err);
        } else {
            res.json(conversation);
        }
    });
});
module.exports = router;