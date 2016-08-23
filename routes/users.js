var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.get('/', function (req, res) {
    User.find(function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});


router.post('/', function (req, res) {
    User.create(req.body, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

module.exports = router;