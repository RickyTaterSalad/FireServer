var router = require('express').Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.get('/', function (req, res) {
    Post.find(function (err, post) {
        if (err) {
            res.send(err);
        } else {
            res.json(post);
        }
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id) {
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                res.json(post);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});


router.post('/', function (req, res) {
    Post.create(req.body, function (err, post) {
        if (err) {
            res.send(err);
        } else {
            res.json(post);
        }
    });
});

module.exports = router;