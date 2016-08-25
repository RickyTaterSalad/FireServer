var mongoose = require("mongoose");
var async = require('async');

var conversationGenerator = require("./generateConversations");

//init mongoose
require("../helpers/mongoose-helper").initialize();
var Account = mongoose.model('Account');
var Department = mongoose.model('Department');
var Station = mongoose.model('Station');
var Post = mongoose.model('Post');
var username = "fire";
var password = "fire";

var createDepartment = function (callback) {
    console.log("Create dept");
    var dept = {
        "name": "LAFD",
        "platoons": [
            "A",
            "B",
            "C"
        ],
        "schedule": {
            "name": "Schedule Name",
            "numberOfPlatoons": 3,
            "platoonSchedule": "A,C,A,B,A,B,C,B,C",
            "shiftLengthInHours": 24,
            "shiftStartTime": "0800"
        },
        "stations": []
    };
    Department.create(dept, callback);
};

var createStation = function (callback) {
    console.log("create station");
    var station = {
        "stationNumber": "1",
        "community": "Redlands",
        "street": "380 New York",
        "city": "Redlands",
        "state": "CA",
        "zip": 92223

    };
    Station.create(station, callback);

};
var addStationToDepartment = function (department, station, callback) {
    Department.findByIdAndUpdate(department._id, {
        $push: {"stations": station._id}
    }, null, callback);
};

var createStationAndDepartment = function (callback) {


    console.log("create station and dept");
    var department;
    var station;

    async.waterfall([
        createDepartment,
        function (dp, callback) {
            console.log("got dept callback");
            department = dp;
            callback();
        },
        createStation,
        function (st, callback) {
            station = st;
            callback();
        }, function (callback) {
            console.log("adding station to dept.");
            addStationToDepartment(department, station, callback);
        }, function () {
            console.log("create station and dept complete");
            callback(null, {departmentId: department._id, stationId: station._id});
        }]);

};
var createFireUser = function (departmentId, stationId, username, callback) {
    var account = {
        firstName: username,
        lastName: username,
        department: departmentId,
        station: stationId,
        email: "fire@fire.com",
        localAuthUid: username
    };
    Account.create(account, function (err, data) {
        console.log("created  user");
        callback();
    });
};

var createPosts = function (departmentId, stationId, userId, callback) {
    async.series([
        function (cb1) {
            console.log("first create post");
            createPost(departmentId, stationId, userId, 15719749980000, "off", cb1);
        },

        function (callback) {
            createPost(departmentId, stationId, userId, 15719749980000, "off", callback)
        },
        function (callback) {
            createPost(departmentId, stationId, userId, 15719249980000, "on", callback)
        },
        function (callback) {
            createPost(departmentId, stationId, userId, 15219749980000, "off", callback)
        },
        function (callback) {
            createPost(departmentId, stationId, userId, 15719749999900, "off", callback)
        },
        function (callback) {
            createPost(departmentId, stationId, userId, 15719749999900, "on", callback);
        },
        function (callback) {
            createPost(departmentId, stationId, userId, 15719729999900, "off", callback);
        },
        function (callback) {
            createPost(departmentId, stationId, userId, 15739749999900, "on", callback);
        }

    ], function () {
        console.log("create posts complete");
        callback();
    });
};

var createPost = function (departmentId, stationId, userId, shift, type, callback) {
    console.log("Create post");
    var post =
    {
        "department": departmentId,
        "station": stationId,
        "creator": userId,
        "shift": shift,
        "isRegular": true,
        "requestType": type,
        "platoon": "A"
    };
    console.log("POST To Create: " + JSON.stringify(post));
    Post.create(post, callback);
};

var getFireUser = function (callback) {
    console.log("find fire user");
    Account.findOne({"firstName": "fire"}, function (err, res) {
        console.log("got fire user");
        callback(err, res);

    });
};

var run = function () {
    console.log("run");
    var stationAndDeptObj = null;
    async.waterfall([
        createStationAndDepartment,
        function (stationAndDep, cb1) {
            stationAndDeptObj = stationAndDep;
            cb1();
        },
        function (callback) {
            console.log("create fire user");
            createFireUser(stationAndDeptObj.departmentId, stationAndDeptObj.stationId, "fire", callback);
        },
        function (callback) {
            console.log("create fire2 user");
            createFireUser(stationAndDeptObj.departmentId, stationAndDeptObj.stationId, "fire2", callback);

        },
        getFireUser,
        function (fireUser, callback) {
            console.log("create posts to id " + fireUser._id);
            createPosts(stationAndDeptObj.departmentId, stationAndDeptObj.stationId, fireUser._id, callback)
        },
        conversationGenerator.createConversations,
        function (err, result) {
            if (err) {
                console.log("there was an error populating the database");
            }
            else {
                console.log("complete.");
            }
            process.exit();
        }]);
};
module.exports = {
    run: run
};
run();