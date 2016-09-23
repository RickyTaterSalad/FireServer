var router = require('express').Router();
var postController = require("../controllers/post-controller");
var conversationController = require("../controllers/conversation-controller");
const hasUser = require("../validators/has-user-validator").validate;
const postValidator = require("../validators/post-validator").validate;
const claimShiftValidator = require("../validators/post-validator").claimShiftValidator;
var dateUtils = require("../util/date-utils");
var debug = require('debug')('fireServer:server');


var returnClaimError = function (req, res, postId, options) {
    if (!options) {
        options = {};
    }
    debug("ERROR POST ID: " + postId);
    postController.findById(postId).then(function (post) {
        debug(arguments);
        var errorMsg = "";
        if (!post) {
            errorMsg = "Post Does Not Exist";
        }
        else if (post.claimantHasConfirmed && options.isClaim) {
            errorMsg = "Post Has Already Been Claimed";
        }
        else if (options.isClaim && post.claimant != null && post.claimant != req.user.id) {
            errorMsg = "Post Is Already Pending Confirmation";
        }
        else if(options.isConfirmClaim && post.claimant != null && post.claimant != req.user.id){
            errorMsg = "You Cannot Confirm Claim On This Post";
        }
        else if (options.isClaim && post.claimant != req.user.id && post.creator != req.user.id) {
            errorMsg = "You Are Not Part Of This Post";
        }

        else {
            errorMsg = "Cannot Perform This Operation";
        }
        return res.json({success: false, message: errorMsg});
    });
}

router.get('/postCounts/:startDay', hasUser, function (req, res) {
    if (!req.params.startDay) {
        return res.status(400).send();
    }
    var startDate;
    var endDate;
    try {
        debug("Start Date: " + req.params.startDay);
        var startDayAsInt = parseInt(req.params.startDay, 10);
        debug("Start Date: " + startDayAsInt);
        startDate = dateUtils.dateFromMS(startDayAsInt);
        endDate = dateUtils.dateFromMS(startDayAsInt).add(41, "days");
        debug("Start Date: " + startDate + " end date: " + endDate);
    }
    catch (err) {
        debug("could not parse day");
        debug(err);
        return res.status(400).send();
    }
    postController.getPostCountsInDateRange(startDate, endDate, {excludeUser: req.locals.userId}).then(function (posts) {
        return res.json(posts);
    });

});

router.get('/myOffers', hasUser, function (req, res) {
    postController.allOffersForUser(req.user).then(function (posts) {
        var postIds = posts.map(function (p) {
            return p._id
        });
        conversationController.conversationsForUserAndPosts(req.user, postIds, {populate: "recipient"}).then(function (convs) {
            return res.json({
                posts: posts,
                conversations: convs
            });
        });

    });
});
router.get('/myPosts', hasUser, function (req, res) {
    postController.allPostingsForUser(req.user).then(function (posts) {
        var postIds = posts.map(function (p) {
            return p._id
        });
        conversationController.conversationsForUserAndPosts(req.user, postIds, {populate: "creator"}).then(function (convs) {
            return res.json({
                posts: posts, conversations: convs
            });
        });
    });
});
router.get('/self/:type', hasUser, function (req, res) {
    var postTypeLower = req.params.type ? req.params.type.toLowerCase() : "";
    if (postTypeLower != "off" && postTypeLower != "on") {
        return res.status(400).send("Invalid Post Type");
    }
    postController.forUserFilterType(req.user, postTypeLower).then(function (posts) {
        return res.json(posts);
    });
});


router.get("/hasPost/:year/:month/:day", hasUser, function (req, res) {
    if (!req.params || !req.params.year || !req.params.month || !req.params.day) {
        return res.status(400).send();
    }
    var date = dateUtils.dateFromDayMonthYear(req.params.day, req.params.month, req.params.year);
    debug("Has Posts For: " + date.format('MMMM Do YYYY'));
    if (!date) {
        return res.status(400).send();
    }

    postController.userHasPostForDate(req.locals.userId, date).then(function (hasPost) {
        return res.json({hasPost: hasPost});
    });
});


router.get('/:year/:month/:day', hasUser, function (req, res) {
    //don't return the users posts on this query
    if (!req.params || !req.params.year || !req.params.month || !req.params.day) {
        return res.status(400).send();
    }
    var date = dateUtils.dateFromDayMonthYear(req.params.day, req.params.month, req.params.year);
    debug("Shifts For: " + date.format('MMMM Do YYYY'));
    if (!date) {
        return res.status(400).send();
    }

    postController.allForDate(date, {loadUser: true, excludeUser: req.locals.userId}).then(function (posts) {
        return res.json(posts);
    });
});
router.get('/:id', hasUser, function (req, res) {
    if (req.params && req.params.id) {
        postController.findById(req.params.id).then(function (post) {
            if (!post) {
                return res.status(400).send();
            }
            return res.json(post);
        });
    }
    else {
        return res.status(400).send();
    }
});
router.delete("/:postId", hasUser, function (req, res) {
    postController.remove(req.user.id, req.params.postId).then(function (response) {
        if (!response) {
            return res.status(400).send("Could Not Delete Requested Post");
        }
        else {
            return res.json({success: true, message: "complete"});
        }
    });
});
router.post('/cancelConfirmedClaim/:postId', hasUser, function (req, res) {
    if (!req.params || !req.params.postId) {
        return res.status(400).send();
    }
    postController.cancelConfirmedClaim(req.params.postId, req.user.id).then(function (response) {
        if (!response) {
            //failed to update. retrieve the post to see why
            return returnClaimError(req, res, req.params.postId, {isClaim: false});
        }
        else {
            return res.json({success: true});
        }
    })
});


router.post('/confirmClaim/:postId', hasUser, function (req, res) {
    if (!req.params || !req.params.postId) {
        return res.status(400).send();
    }
    debug("Post Id: " + req.params.postId);
    postController.confirmClaim(req.params.postId, req.user.id).then(function (response) {
        if (!response || response.n != 1) {
            //failed to update. retrieve the post to see why
            return returnClaimError(req, res, req.params.postId, {isConfirmClaim: true});
        }
        else {
            return res.json({success: true});
        }
    })
});

router.post('/claim', hasUser, claimShiftValidator, function (req, res) {
    debug("------------");
    debug(req.locals);
    debug("------------");
    if (req.locals && req.locals.post) {
        postController.claimPost(req.locals.post, req.locals.claimant).then(function (response) {
                if (!response || response.n != 1) {
                    //failed to update. retrieve the post to see why
                    return returnClaimError(req, res, req.locals.post, {isClaim: true});
                }
                else {
                    return res.json({success: true});

                }
            }
        )
    }
    else {
        return res.status(400).send("Invalid Post");
    }
})
;


router.post('/', hasUser, postValidator, function (req, res) {
    debug("creating post");
    if (req.locals && req.locals.post) {
        postController.create(req.locals.userId, req.locals.post)
            .then(function (post) {
                return !post ? res.status(400).send("Could Not Create Post")
                    : res.json(post);
            });
    }
    else {
        return res.status(400).send();
    }
});
module.exports = router;
