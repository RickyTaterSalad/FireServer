var faker = require("faker");
var async = require("async");
var accountController = require("../../../controllers/account-controller");
var platoonGenerator = require('./generate-platoons');
var Post = require('mongoose').model('Post');


var generatePosts = function (count, callback) {
    var fxns = [];
    for (var i = 0; i < count; i++) {
        fxns.push(generatePost);
    }
    async.series(fxns, callback);
};

var generatePost = function (callback) {
    accountController.getRandom().then(function (account) {
        if (!account) {
            console.log("could not retrieve random account to generatePost");
            callback();
        }
        var post = new Post({
                department: account.department,
                station: account.station,
                creator: account._id,
                shift: faker.date.future(),
                platoon: platoonGenerator.generatePlatoon()
            });
        post.requestType = faker.random.boolean() ? "on" : "off";
        if (faker.random.boolean()) {
            post.isRegular = true;
        }
        else {
            post.isOvertime = true;
        }

        var err = post.validateSync();
        if(err){
            console.log("generated invalid post");
            callback();
        }
        else {
            post.save(function(err){
                if(err){
                    console.log("error creating post");
                    console.dir(err);
                }
                else{
                    console.log("created post");
                }
                callback()
            });
        }
    });
};
module.exports = {
    generatePosts: generatePosts,
    generatePost: generatePost
};