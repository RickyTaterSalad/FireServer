//model types passed can be either the instance itself or the object id
var Post = require('mongoose').model('Post');
var Promise = require("bluebird");
var conversationController = require("./conversation-controller");

var controllerUtils = require("../util/controller-utils");
var requestHelperMethods = require("../util/request-helper-methods");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Post);
};

var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Post, id);
};

var findByIds = function (/*Array<ObjectId>*/ ids) {
    return Post.find({
        _id: { $in: ids}
    });
};
var allOffersForUser = function (/*Acccount */ user) {
    //todo might want to store offers on the users account
    if (!user) {
        Promise.resolve([]);
    }
   return conversationController.findByCreator(user,false).then(function (conversations) {
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
    return Post.find({
        creator: user._id
    }).sort("shift");
};
var allForDate = function (/*Moment*/ date, options) {
    if (!date) {
        Promise.resolve([]);
    }
    if (options) {
        if (options.loadUser) {
            return Post.find({
                shift: date.valueOf()
            }).populate("creator station").exec();
        }
    }
    return Post.find({
        shift: date.valueOf()
    }).populate("station").exec();
};

var findUsersPost = function (/*ObjectId */ account, /*ObjectId*/ postId) {
    if (!account || !postId || !account) {
        Promise.resolve(true);
    }
    var params = {
        creator: account,
        _id: postId
    };
    return Post.findOne(params);
};


var allForDateAtStation = function (/*Date */ date, /*ObjectId*/ stationId) {
    if (!date || !stationId) {
        Promise.resolve([]);
    }
    return Post.find({
        shift: date.valueOf(),
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

var deletePost = function (/*ObjectId*/ ownerId, /*ObjectId */ postId) {
    var params = {
        _id: postId,
        creator: ownerId
    };
    return Post.remove(params);
};

//writes a post to the database
var createPost = function (/*Post*/ post) {
    if (canCreatePost(post)) {
        return post.save();
    }
    else return Promise.resolve(null);
};
var claimPost = function (/*Post */ post, /*ObjectID */ claiment) {
    if (!post || !claiment) {
        return Promise.resolve(null);
    }
    return post.update({claiment: claiment}, {new: true});
}

var exports = {
    findById: findById,
    allPostingsForUser: allPostingsForUser,
    forUserFilterType: forUserFilterType,
    allForDate: allForDate,
    allForDateAtStation: allForDateAtStation,
    canCreatePost: canCreatePost,
    userHasPostForDate: userHasPostForDate,
    createPost: createPost,
    deletePost: deletePost,
    findUsersPost: findUsersPost,
    allOffersForUser: allOffersForUser,
    claimPost: claimPost
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
