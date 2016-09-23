var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var postController = require("../controllers/post-controller");
var conversationController = require("../controllers/conversation-controller");
var util = require("util");
var dateUtil = require("../util/date-utils");
var debug = require('debug')('fireServer:server');

var momentParseOptions = {startOfDay: true};

var config = require("config");
var workingDept = config.get("workingDepartment");
var deptController = require("../controllers/department-controller");


var claimShiftValidator = function (req, res, next) {
    if (!req.body.post || !req.body.post.id) {
        debug("post missing");
        return res.status(400).send("Post Is Missing");
    }
    if (!req.body.claimant || !req.body.claimant.id) {
        debug("no claimant");
        return res.status(400).send("No claimant Specified");
    }
    //make sure the claimant has messaged the user about this post. don't want people to set other users as claimants without talking to them
    conversationController.findByUserAndPostId(req.body.claimant.id, req.body.post.id).then(function (conversations) {
        if (!conversations || conversations.length == 0) {
            return res.status(400).send("Cannot Claim Post Without Messaging User");
        }
        postController.findUsersPost(req.locals.userId, req.body.post.id).then(function (post) {
            if (!post) {
                return res.status(400).send("You Are Not The Creator Of This Post");
            }
            if (post.claimant != null) {
                return res.status(400).send("This Post Has Already Been Claimed");
            }
            if (!req.locals) {
                req.locals = {};
            }
            req.locals.post = post;
            req.locals.claimant = req.body.claimant.id;
            next();

        })
    });
};

var validate = function (req, res, next) {
    if (!req.body.post) {
        return res.status(400).send("Post Is Missing");
    }
    var shift = dateUtil.dateFromMS(req.body.post.shift, momentParseOptions);
    var shiftValid = shift != null && shift.isValid();
    var shiftIsInPast = dateUtil.isDateBeforeToday(shift);
    if (!shift || !shiftValid || shiftIsInPast) {
        var msg = "";
        debug("Cannot add post");
        if (!shift) {
            msg = "No Shift Provided";
            debug(msg)
        }
        else if (!shiftValid) {
            msg = "Shift Is Invalid";
            debug(msg)
        }
        else if (shiftIsInPast) {
            msg = "Shift Is In The Past";
            debug(msg)
        }
        debug(msg);
        return res.status(400).send(msg);
    }
    deptController.findByDepartmentName(workingDept).then(function (dept) {
        debug("DEPT: " + workingDept);
        if (!dept || !dept.schedule || !dept.schedule.shiftStartTime) {
            debug("could not retrieve shift start time");
            return res.status(400).send("Could Not Retrieve Shift Start");
        }
        var params = {
            creator: req.locals.userId,
            shift: shift,
            comments: req.body.post.comments,
            department: req.user.department,
            station: req.user.station,
            isTrade: req.body.post.isTrade,
            isOvertime: req.body.post.isOvertime,
            isAssignedHire: req.body.post.isAssignedHire,
            isRegular: req.body.post.isRegular,
            requestType: req.body.post.requestType,
            shiftStartTime: dept.schedule.shiftStartTime,
            platoon: req.user.platoon
        };
        var post = new Post(params);
        var error = post.validateSync();
        if (error) {
            debug("post validation failed");
            debug(JSON.stringify(error.message));
            return res.status(400).send("Invalid Post Parameters");
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
                    debug(util.format("post with type: %s for day %s already exists for user %s", req.body.post.requestType, shift, req.locals.userId));
                    return res.status(400).send("You Already Have A Post For This Shift");
                }
            });
        }
    });
};

module.exports = {
    validate: validate,
    claimShiftValidator: claimShiftValidator
};