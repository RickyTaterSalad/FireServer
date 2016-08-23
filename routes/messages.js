var router = require('express').Router();
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

router.get('/', function (req, res) {
    Message.find(function (err, message) {
        if (err) {
            res.send(err);
        } else {
            res.json(message);
        }
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id) {
        Message.findById(req.params.id, function (err, message) {
            if (err) {
                res.send(err);
            } else {
                res.json(message);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});


router.post('/', function (req, res) {
    Message.create(req.body, function (err, message) {
        if (err) {
            res.send(err);
        } else {
            res.json(message);
        }
    });
});

module.exports = router;