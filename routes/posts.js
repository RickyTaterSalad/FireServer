var router = require('express').Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
const RequestHelperMethods = require("../util/request-helper-methods");

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
    if (RequestHelperMethods.validObjectId(req.params.id)) {
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                console.log(JSON.stringify(post));
                res.json(post);
            }
        });
    }
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});


router.post('/', function (req, res) {
    if (req.user) {
        if (!req.user.department) {
            return res.json({success: false, message: "user has no department"});

        }
        if (!req.user.station) {
            return res.json({success: false, message: "user has no station"});

        }
        var post = JSON.parse(JSON.stringify(req.body));
        post.creator = req.user._id;
        post.station = req.user.Station;
        post.department = req.user.Department;
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
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

module.exports = router;