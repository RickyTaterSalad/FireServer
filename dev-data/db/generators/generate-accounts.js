var faker = require("faker");
var async = require("async");
var Account = require('mongoose').model('Account');
var departmentController = require("../../../controllers/department-controller");
var stationController = require("../../../controllers/station-controller");
var debug = require('debug')('fireServer:server');
var fakePlatoons = ["A", "B", "C"];

var getRandomPlatoon = function () {
    return fakePlatoons[Math.floor(Math.random() * fakePlatoons.length)];
};
var generateAccounts = function (count, callback) {
    var fxns = [];
    for (var i = 0; i < count; i++) {
        fxns.push(generateAccount);
    }
    async.series(fxns, callback);
};

var generateAccount = function (callback) {
    departmentController.getRandom().then(function (dept) {
        stationController.getRandom().then(function (station) {
            var account = new Account({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                department: dept._id,
                station: station._id,
                email: faker.internet.email(),
                localAuthUid: faker.internet.userName(),
                platoon: getRandomPlatoon()
            });
            var err = account.validateSync();
            if(err){
                debug("generated invalid account");
                debug(err);
                callback();
            }
            else {
                account.save(function (err) {
                    if (err) {
                        debug("error creating account");
                        debug(err);
                    }
                    else {
                        debug("created account");
                    }
                    callback()
                });
            }
        });
    })


};
module.exports = {
    generateAccounts: generateAccounts,
    generateAccount: generateAccount
};