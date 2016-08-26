var router = require('express').Router();
var Post = require('mongoose').model('Post');
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
const postValidator = require("../validators/post-validator").validate;
router.get('/', hasUser, function (req, res) {
    Post.find(function (err, post) {
        if (err) {
            res.send(err);
        } else {
            res.json(post);
        }
    });
});
router.get('/:id', hasUser, function (req, res) {
    if (RequestHelperMethods.validObjectId(req.params.id)) {
        Post.findById(req.params.id, function (err, post) {
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
router.post('/', hasUser, postValidator, function (req, res) {
    req.locals.post.save(function (err) {
        return err ? res.json(RequestHelperMethods.invalidRequestJson) : res.json(req.locals.post);
    });
});

module.exports = router;