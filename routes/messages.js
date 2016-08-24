var router = require('express').Router();
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

router.get('/received', function (req, res) {
    if (req.user) {
        Message.find({'recipient': req.user._id}, function (err, message) {
            if (err) {
                res.send(err);
            } else {
                res.json(message);
            }
        });
    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});
router.get('/sent', function (req, res) {
    if (req.user) {
        var params = {'sender': req.user._id};
        console.log("sent params: " + JSON.stringify(params));
        Message.find(params, function (err, message) {
            console.log("messages sent");
            console.log("sent params: " + JSON.stringify(message));
            if (err) {
                res.send(err);
            } else {
                res.json(message);
            }
        });
    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});
router.get('/:id', function (req, res) {
    if (req.params.id && req.user) {
        Message.find({
            _id: req.params.id,
            $or: [{'creator': req.user._id}, {'recipient': req.user._id}]
        }, function (err, message) {
            if (err) {
                res.send(err);
            } else {
                res.json(message);
            }
        });
    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});
router.post('/', function (req, res) {
    if (req.user) {
        var message = JSON.parse(JSON.stringify(req.body));
        message.sender = req.user._id;
        //debug
        console.log("creating message: " + JSON.stringify(message));
        Message.create(message, function (err, message) {
            if (err) {
                res.send(err);
            } else {
                res.json(message);
            }
        });
    }
    else{
        res.json({success: false, message: "Invalid request"});
    }
});

module.exports = router;