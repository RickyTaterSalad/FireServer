var Post = require('mongoose').model('Post');
const RequestHelperMethods = require("../util/request-helper-methods");
var postController = require("../controllers/post-controller");
var util = require("util");
var dateUtil = require("../util/date-utils");
var debug = require('debug')('fireServer:server');

var momentParseOptions = {startOfDay:true};

var validate = function (req, res, next) {
    if (!req.user.department) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    if (!req.user.station) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    var shift = dateUtil.dateFromMS(req.body.shift,momentParseOptions);
    if(!shift || ! shift.isValid()){
       return res.json(RequestHelperMethods.invalidRequestJson);
    }
    var post = new Post({
        creator: req.locals.userId,
        shift: shift,
        department: req.user.department,
        station: req.user.station,
        isTrade:req.body.isTrade,
        isOvertime: req.body.isOvertime,
        isAssignedHire: req.body.isAssignedHire,
        isRegular: req.body.isRegular,
        requestType: req.body.requestType,
        platoon: req.body.platoon
    });
    var error = post.validateSync();
    if (error) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    else {
        if (!req.locals) {
            req.locals = {};
        }
        postController.canCreatePost(post).then(function(canCreate){
            if(canCreate){
                req.locals.post = post;
                next();
            }
            else{
                debug(util.format("post with type: %s for day %s already exists for user %s",shift, req.locals.userId));
                return res.json({success: false, message: "User already has post for that day"});
            }
        });
    }
};

module.exports = {
    validate: validate
};