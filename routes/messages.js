var router = require('express').Router();
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
const RequestHelperMethods = require("../util/request-helper-methods");

const hasUser = require("../validators/has-user-validator").validate;
const validateMessage = require("../validators/message-validator").validate;

router.get('/received', hasUser, function (req, res) {
    Message.find({'recipient': req.locals.userId}, function (err, message) {
        if (err) {
            res.send(err);
        } else {
            res.json(message);
        }
    });
});
router.get('/sent', hasUser, function (req, res) {
    var params = {'sender': req.locals.userId};
    Message.find(params, function (err, message) {
        if (err) {
            res.send(err);
        } else {
            res.json(message);
        }
    });


});
router.get('/:id', hasUser, function (req, res) {
    if (req.params.id) {
        Message.find({
            _id: req.params.id,
            $or: [{'creator': req.locals.userId}, {'recipient': req.locals.userId}]
        }, function (err, message) {
            if (err) {
                res.send(err);
            } else {
                res.json(message);
            }
        });
    }
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});
router.post('/', hasUser, validateMessage, function (req, res) {
    req.locals.message.save(function (err) {
        return err ? res.json(RequestHelperMethods.invalidRequestJson) : res.json(req.locals.message);
    });
});

module.exports = router;