var Post = require('mongoose').model('Post');
const RequestHelperMethods = require("../util/request-helper-methods");
var postController = require("../controllers/post-controller");
var util = require("util");
var dateUtil = require("../util/date-utils");
var debug = require('debug')('fireServer:server');

var momentParseOptions = {startOfDay: true};

var config = require("config");
var workingDept = config.get("workingDepartment");
var deptController = require("../controllers/department-controller");


var validate = function (req, res, next) {
    if (!req.user.department) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    if (!req.user.station) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    var shift = dateUtil.dateFromMS(req.body.shift, momentParseOptions);
    var shiftValid = shift != null && shift.isValid();
    var shiftIsInPast = dateUtil.isDateBeforeToday(shift);
    if (!shift || !shiftValid || shiftIsInPast) {
        var msg = "";
        debug("Cannot add post");
        if (!shift) {
            msg = "shift is null";
            debug(msg)
        }
        else if (!shiftValid) {
            msg = "shift is not a valid time";
            debug(msg)
        }
        else if (!shiftIsInPast) {
            msg = "shift is in the past";
            debug(msg)
        }
        return res.json({success: false, message: debug});
    }
    deptController.findByDepartmentName(workingDept).then(function (dept) {
        debug("DEPT: " + workingDept);
        if (!dept || !dept.schedule || !dept.schedule.shiftStartTime) {
            debug("could not retrieve shift start time");
            return res.json(RequestHelperMethods.invalidRequestJson);
        }
        var params = {
            creator: req.locals.userId,
            shift: shift,
            department: req.user.department,
            station: req.user.station,
            isTrade: req.body.isTrade,
            isOvertime: req.body.isOvertime,
            isAssignedHire: req.body.isAssignedHire,
            isRegular: req.body.isRegular,
            requestType: req.body.requestType,
            shiftStartTime: dept.schedule.shiftStartTime,
            platoon: req.body.platoon
        };
        var post = new Post(params);
        var error = post.validateSync();
        if (error) {
            debug(error.message);
            return res.json(RequestHelperMethods.invalidRequestJson);
        }
        else {
            if (!req.locals) {
                req.locals = {};
            }

            postController.canCreatePost(post).then(function (canCreate) {
                if (canCreate) {
                    req.locals.post = post;
                    next();
                }
                else {
                    debug(util.format("post with type: %s for day %s already exists for user %s",req.body.requestType, shift, req.locals.userId));
                    return res.json({success: false, message: "User already has post for that day"});
                }
            });
        }
    });
};

module.exports = {
    validate: validate
};