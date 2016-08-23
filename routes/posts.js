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
    if(req.user) {
        if (!req.user.Department) {
            return res.json({success: false, message: "user has no department"});

        }
        if (!req.user.Station) {
            return res.json({success: false, message: "user has no station"});

        }
        var post = JSON.parse(JSON.stringify(req.body));
        post.Creator = req.user._id;
        post.Station = req.user.Station;
        post.Department = req.user.Department;
        //debug
        console.log("creating conversation: " + JSON.stringify(post));
        Post.create(post, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                res.json(post);
            }
        });
    }
    else{
        res.json({success: false, message: "Invalid request"});
    }
});

module.exports = router;