var router = require('express').Router();
var postController = require("../controllers/post-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
const postValidator = require("../validators/post-validator").validate;
var dateUtils = require("../util/date-utils");


router.get('/user', hasUser, function (req, res) {
    postController.allForUser(req.user).then(function (posts) {
        return res.json(posts);
    });
});

router.get('/:year/:month/:day', hasUser, function (req, res) {
    if (!req.params || !req.params.year || !req.params.month || !req.params.day) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    var date = dateUtils.dateFromDayMonthYear(req.params.day, req.params.month, req.params.year);
    if (!date) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    postController.allForDate(date).then(function (posts) {
        return res.json(posts);
    });
});
router.get('/:id', hasUser, function (req, res) {
    if (req.params && RequestHelperMethods.validObjectId(req.params.id)) {
        postController.findById(req.params.id).then(function (post) {
            return res.json(post);
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