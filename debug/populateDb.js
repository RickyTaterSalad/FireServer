var Promise = require("bluebird");
var mongoose = require("mongoose");
var async = require('async');

var conversationGenerator = require("./generateConversations");

var mongooseHelper = require("../helpers/mongoose-helper").initialize();
var Account = mongoose.model('Account');
var Department = mongoose.model('Department');
var Station = mongoose.model('Station');
var Post = mongoose.model('Post');
var username = "fire";
var password = "fire";

var createDepartment = function () {
    var dept = {
        "Name": "LAFD",
        "Platoons": [
            "A",
            "B",
            "C"
        ],
        "Schedule": {
            "Name": "Schedule Name",
            "NumberOfPlatoons": 3,
            "PlatoonSchedule": "A,C,A,B,A,B,C,B,C",
            "ShiftLengthInHours": 24,
            "ShiftStartTime": "0800"
        },
        "Stations": []
    };
    return new Promise(function (resolve, reject) {
        Department.create(dept, function (err, department) {
            console.log("created department");
            err ? reject(err) : resolve(department);
        });
    });
};

var createStation = function () {
    var station = {
        "StationNumber": "1",
        "Community": "Redlands",
        "Street": "380 New York",
        "City": "Redlands",
        "State": "CA",
        "Zip": 92223

    };
    return new Promise(function (resolve, reject) {
        Station.create(station, function (err, department) {
            err ? reject(err) : resolve(department);
        });
    });

};
var addStationToDepartment = function (department, station) {
    return new Promise(function (resolve, reject) {
        Department.findByIdAndUpdate(department._id, {
            $push: {"Stations": station._id}
        }, null, function (err, updateResult) {
            err ? reject(err) : resolve(updateResult);
        });
    });
};

var createStationAndDepartment = function () {
    return new Promise(function (resolve, reject) {
        var deptId;
        var stationId;
        createDepartment().catch(function (e) {
            console.log("could not create department");
            console.dir(e);
            reject()
        }).then(function (department) {
            console.log("Created Dept:" + JSON.stringify(department));
            deptId = department._id;
            console.log("dept id: " + deptId);
            createStation().catch(function (e) {
                console.log("could not create station");
                console.dir(e);
                reject()
            }).then(function (station) {
                console.log("Created station:" + JSON.stringify(station));
                stationId = station._id;
                addStationToDepartment(department, station).catch(function (e) {
                    console.log("could not add station to department");
                    console.dir(e);
                    reject()
                }).then(function (dept2) {
                    console.log("Associated station with dept:" + JSON.stringify(dept2));
                    var response = {stationId: stationId, departmentId: deptId};
                    console.dir(response);
                    resolve(response);
                })
            })
        })
    });
};
var createFireUsers = function (departmentId, stationId, username) {
    return new Promise(function (resolve, reject) {
        var account = {
            FirstName: username,
            LastName: username,
            Department: departmentId,
            Station: stationId,
            Email: "fire@fire.com",
            LocalAuthUid: username
        };
        Account.create(account, function (err, account) {
            if (account) {
                console.log("created account: " + username);
            }
            if (username == "fire") {
                createFireUsers(departmentId, stationId, "fireuser2").catch(function (err) {
                    console.log("could not create user: " + username);
                    reject();
                }).then(function (account) {
                    err ? reject(err) : resolve(account);
                });
            }
            else {
                resolve(account);
            }

        });
    });
};

var createPosts = function (departmentId, stationId, userId, type) {
    return new Promise(function (resolve, reject) {
        createPost(departmentId, stationId, userId, 15719749980000, "off").then(function () {
            createPost(departmentId, stationId, userId, 15719249980000, "on").then(function () {
                createPost(departmentId, stationId, userId, 15219749980000, "off").then(function () {
                    createPost(departmentId, stationId, userId, 15719749999900, "off").then(function () {
                        createPost(departmentId, stationId, userId, 15719729999900, "off").then(function () {
                            createPost(departmentId, stationId, userId, 15739749999900, "on").then(function (post) {
                                resolve(post);
                            })
                        })
                    })
                })
            })
        })
    });
};

var createPost = function (departmentId, stationId, userId, shift, type) {
    var post =
    {
        "Department": departmentId,
        "Station": stationId,
        "Creator": userId,
        "Shift": shift,
        "IsRegular": true,
        "RequestType": type,
        "Platoon": "A"
    };
    console.log("POST To Create: " + JSON.stringify(post));
    return new Promise(function (resolve, reject) {
        Post.create(post, function (err, post) {
            if (post) {
                console.log("created post: " + JSON.stringify(post));
            }
            err ? reject(err) : resolve(post);

        });
    });
};

var getFireUser = function () {
    return new Promise(function (resolve, reject) {
        Account.findOne({"FirstName": "fire"}, function (err, fireUser) {
            if (fireUser) {
                console.log("found fire user: " + JSON.stringify(fireUser));
            }
            err ? reject(err) : resolve(fireUser);

        });
    });
};

var run = function () {
    createStationAndDepartment().catch(function (err) {
        console.log("creating station and dept failed");
    }).then(function (stationAndDeptObj) {
        createFireUsers(stationAndDeptObj.departmentId, stationAndDeptObj.stationId, "fire").catch(function (err) {
            console.log("error creating accounts");
        }).then(function (account) {
            getFireUser().catch(function (err) {
                console.log("could not find fire user");
                process.exit();
            }).then(function (fireUser) {
                createPosts(stationAndDeptObj.departmentId, stationAndDeptObj.stationId, fireUser._id).then(function () {
                    console.log("done");
                    conversationGenerator.createConversations().catch(function (err) {
                        console.log("could not generate conversations");
                        process.exit();
                    }).then(function () {
                        console.log("complete");
                        process.exit();

                    });
                });
            });
        });

    });
};
module.exports = {
    run: run
};
run();