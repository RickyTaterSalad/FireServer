//model types passed can be either the instance itself or the object id
var Post = require('mongoose').model('Post');
var Promise = require("bluebird");

var controllerUtils = require("../util/controller-utils");


var getRandom = function () {
    return controllerUtils.getRandomDocument(Post);
};

var findById = function (/*ObjectId*/ id) {
   return controllerUtils.byId(Post,id);
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
    });
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
        return post != null;
    });
};
var exports = {
    findById: findById,
    allForUser: allForUser,
    allForDate: allForDate,
    allForDateAtStation: allForDateAtStation,
    canCreatePost: canCreatePost
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
