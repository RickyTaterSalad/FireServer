//model types passed can be either the instance itself or the object id
var Post = require('mongoose').model('Post');
var Promise = require("bluebird");
var RequestHelperMethods = require("../util/request-helper-methods");
var controllerUtils = require("../util/controller-utils");


var getRandom = function () {
    return controllerUtils.getRandomDocument(Post);
};

var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Post, id);
};

var allForUser = function (/*Account*/ user) {
    if (!user) {
        Promise.resolve([]);
    }
    return Post.find({
        creator: user._id
    });
};
var allForDate = function (/*Moment*/ date) {
    if (!date) {
        Promise.resolve([]);
    }
    return Post.find({
        shift: date.valueOf()
    }).populate('creator').exec()
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
var deletePostIfBelongsToUser = function (/*ObjectId*/ userId, /*ObjectId*/ postId) {

    if (!RequestHelperMethods.validObjectId(userId) || !RequestHelperMethods.validObjectId(postId)) {
        Promise.resolve(null);
    }
    var params = {
        creator: userId,
        id: postId
    };
    console.dir(params);
    return Post.findOne(params).then(function(post){
      //  console.dir(post);
        return post;
    })//.remove().exec();
};

//returns true if the user already has a post for the requested post date
var canCreatePost = function (/*Post*/ post) {
    if (!post || !post.shift) {
        Promise.resolve(true);
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
var exports = {
    findById: findById,
    allForUser: allForUser,
    forUserFilterType: forUserFilterType,
    allForDate: allForDate,
    allForDateAtStation: allForDateAtStation,
    canCreatePost: canCreatePost,
    deletePostIfBelongsToUser: deletePostIfBelongsToUser
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
