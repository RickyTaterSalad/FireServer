var Post = require('mongoose').model('Post');
const RequestHelperMethods = require("../util/request-helper-methods");
var validate = function (req, res, next) {
    if (!req.user.department) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    if (!req.user.station) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    console.dir(req.user);
    var post = new Post({
        creator: req.locals.userId,
        shift: req.body.shift,
        department: req.user.department,
        station: req.user.station,
        isTrade:req.body.isTrade,
        isOvertime: req.body.isOvertime,
        isAssignedHire: req.body.isAssignedHire,
        isRegular: req.body.isRegular,
        requestType: req.body.requestType,
        platoon: req.body.platoon
    });
    console.dir(post);
    var error = post.validateSync();
    if (error) {
        //console.dir(error);
        res.json(RequestHelperMethods.invalidRequestJson);
    }
    else {
        if (!req.locals) {
            req.locals = {};
        }
        req.locals.post = post;
        next();
    }
};

module.exports = {
    validate: validate
};