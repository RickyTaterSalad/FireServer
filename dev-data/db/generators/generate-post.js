var faker = require("faker");
var async = require("async");
var accountController = require("../../../controllers/account-controller");
var postController = require("../../../controllers/post-controller");
var platoonGenerator = require('./generate-platoons');
var Post = require('mongoose').model('Post');
var debug = require('debug')('fireServer:server');
var moment = require("moment");


const dept = require("../../station-data/department").department;

var generatePosts = function (count, callback) {
    var fxns = [];
    for (var i = 0; i < count; i++) {
        fxns.push(generatePost);
    }
    async.series(fxns,callback );
};

var generatePost = function (callback) {
    accountController.getRandom().then(function (account) {
        if (!account) {

            debug("could not retrieve random account to generatePost");
            callback();
        }
        var futureDate = faker.date.future();
        var futureMoment = moment(futureDate).utc();
        futureMoment.minute(0);
        futureMoment.second(0);
        futureMoment.millisecond(0);
        futureMoment.hour(0);
        var params = {
            department: account.department,
            station: account.station,
            creator: account._id,
            shift: futureMoment,
            platoon: platoonGenerator.generatePlatoon(),
            shiftStartTime: dept.schedule.shiftStartTime,
            comments: faker.lorem.sentence()
        };
        var post = new Post(params);
        post.requestType = faker.random.boolean() ? "on" : "off";
        if (faker.random.boolean()) {
            post.isRegular = true;
        }
        else {
            post.isAssignedHire = true;
        }
        if (faker.random.boolean()) {
            post.isTrade = true;
        }
        else {
            post.isOvertime = true;
        }

        var err = post.validateSync();
        if (err) {
            console.break();
            debug("generated invalid post");
            callback();
        }
        else {
            console.log("Create post outer");
            postController.create(account._id,post).then(function(){
                console.log("callback");
                callback()
            });
        }
    });
};
module.exports = {
    generatePosts: generatePosts,
    generatePost: generatePost
};