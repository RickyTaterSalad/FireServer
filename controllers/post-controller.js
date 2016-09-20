//model types passed can be either the instance itself or the object id
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
var Account = mongoose.model('Account');
var Promise = require("bluebird");
var conversationController = require("./conversation-controller");
var debug = require('debug')('fireServer:server');
var controllerUtils = require("../util/controller-utils");
var requestHelperMethods = require("../util/request-helper-methods");
var async = require('async');

var getRandom = function () {
    return controllerUtils.getRandomDocument(Post);
};

var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Post, id);
};
var archiveBeforeDate = function (/*Moment*/ date) {
    return Post.update({shift: {$lt: date}}, {archived: true}, {multi: true});
};

var findByIds = function (/*Array<ObjectId>*/ ids) {
    return Post.find({
        _id: {$in: ids}
    });
};
var allOffersForUser = function (/*Account */ user) {
    //todo might want to store offers on the users account
    if (!user) {
        Promise.resolve([]);
    }
    return conversationController.findByCreator(user, false).then(function (conversations) {
        var postIds = conversations.map(function (c) {
            return c.post;
        });
        return findByIds(postIds)

    })
};

var allPostingsForUser = function (/*Account*/ user) {
    if (!user) {
        Promise.resolve([]);
    }
    return Account.findById(user._id, "posts").populate("posts").exec().then(function (account) {
        if (account && account.posts) {
            return account.posts.filter(function (post) {
                return !post.archived;
            });
        }
    });
    /*
     return Post.find({
     creator: user._id || user.id,
     archived: false
     }).sort("shift");
     */
};
var allBeforeDateThatAreNotArchived = function (/*Moment*/ date) {
    if (!date) {
        Promise.resolve([]);
    }
    return Post.find({
        shift: {$lt: date.valueOf()},
        archived: false
    }).populate("station").exec();
};
var allForDate = function (/*Moment*/ date, options) {
    if (!date) {
        Promise.resolve([]);
    }
    if (options) {
        var params = {
            shift: date.valueOf(),
            archived: false
        };
        if (options.excludeUser) {
            params.creator = {$ne: options.excludeUser};
        }

        if (options.loadUser) {
            return Post.find(params).populate("creator station").exec();
        }

    }
    return Post.find({
        shift: date.valueOf(),
        archived: false
    }).populate("station").exec();
};

var findUsersPost = function (/*ObjectId */ account, /*ObjectId*/ postId) {
    if (!account || !postId || !account) {
        Promise.resolve(true);
    }
    var params = {
        creator: account,
        _id: postId,
        archived: false
    };
    return Post.findOne(params);
};


var allForDateAtStation = function (/*Date */ date, /*ObjectId*/ stationId) {
    if (!date || !stationId) {
        Promise.resolve([]);
    }
    return Post.find({
        shift: date.valueOf(),
        archived: false,
        station: stationId
    });
};
var forUserFilterType = function (user, postType) {
    if (!postType || !user) {
        Promise.resolve([]);
    }
    var postTypeLower = postType.toLowerCase();
    if (postTypeLower != "off" && postType != "on") {
        return Promise.resolve([]);
    }
    var params = {
        creator: user._id,
        requestType: postType
    };
    return Post.find(params);
};

var userHasPostForDate = function (/*ObjectId */ account, /*Moment*/ date) {
    if (!account || !date || !requestHelperMethods.validObjectId((account))) {
        Promise.resolve(true);
    }
    var params = {
        creator: account,
        shift: date.valueOf()

    };
    return Post.findOne(params).then(function (post) {
        return post != null;
    });
};

//returns true if the user already has a post for the requested post date
var canCreatePost = function (/*Post*/ post) {
    if (!post || !post.shift) {
        return Promise.resolve(true);
    }

    var params = {
        creator: post.creator,
        shift: post.shift.valueOf(),
        requestType: post.requestType
    };
    return Post.findOne(params).then(function (post) {
        return post == null;
    });
};

var remove = function (/*ObjectId*/ ownerId, /*ObjectId */ postId) {
    var params = {
        _id: postId,
        creator: ownerId
    };
    return Post.remove(params);
};

//writes a post to the database
var create = function (/*ObjectId*/ user, /*Post*/ post) {

    console.log("create post");
    if (user && post  && canCreatePost(post)) {

        return post.save().then(function (post) {
            if (!post) {
                return null;
            }
            return Account.update({_id: user}, {$push: {posts: post._id}}).then(function (res) {
                console.log("post created");
                return post;
            });
        });
    }
    else {
        console.log("Cant create post");
        return Promise.resolve(null);
    }
};
var claimPost = function (/*Post */ post, /*ObjectID */ claiment) {
    if (!post || !claiment) {
        return Promise.resolve(null);
    }
    return post.update({claiment: claiment}, {new: true});
};
var getPostCountsInDateRange = function (/*Moment*/ startDate, /*Moment*/ endDate, options) {
    return _getPostCountsInDateRange(startDate, endDate, "off", options).then(function (offRequests) {
        return _getPostCountsInDateRange(startDate, endDate, "on", options).then(function (onRequests) {
            var res = {totalOn: 0, totalOff: 0, days: {}};
            var key;
            for (key in offRequests) {
                if (!res.days[key]) {
                    res.days[key] = {off: 0, on: 0};
                }
                res.days[key].off += offRequests[key];

            }
            for (key in onRequests) {
                if (!res.days[key]) {
                    res.days[key] = {off: 0, on: 0};
                }
                res.days[key].on += onRequests[key];

            }
            for (key in res.days) {
                res.totalOn += res.days[key].on;
                res.totalOff += res.days[key].off;
            }
            return res;
        })

    })
};
var _getPostCountsInDateRange = function (/*Moment*/ startDate, /*Moment*/ endDate, /*string*/ requestType, options) {
    if (!startDate || !endDate) {
        return Promise.resolve([]);
    }


    var o = {};
    o.map = function () {
        emit(this.shift, 1)
    };
    o.query = {
        shift: {$gte: startDate, $lte: endDate},
        requestType: requestType
    };
    if (options) {
        if (options.excludeUser) {
            o.query.creator = {$ne: options.excludeUser}
        }
    }
    o.reduce = function (k, vals) {
        return vals.length
    };
    return Post.mapReduce(o).then(function (res) {
        if (res) {
            var asMap = {};
            for (var i = 0; i < res.length; i++) {
                asMap[res[i]._id] = res[i].value;

            }
            return asMap;
        }
        else {
            return [];
        }
    });
};

var exports = {
    findById: findById,
    allPostingsForUser: allPostingsForUser,
    forUserFilterType: forUserFilterType,
    allForDate: allForDate,
    allForDateAtStation: allForDateAtStation,
    canCreatePost: canCreatePost,
    userHasPostForDate: userHasPostForDate,
    create: create,
    remove: remove,
    findUsersPost: findUsersPost,
    allOffersForUser: allOffersForUser,
    claimPost: claimPost,
    allBeforeDateThatAreNotArchived: allBeforeDateThatAreNotArchived,
    archiveBeforeDate: archiveBeforeDate,
    getPostCountsInDateRange: getPostCountsInDateRange
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
