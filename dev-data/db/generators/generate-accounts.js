var faker = require("faker");
var async = require("async");
var Account = require('mongoose').model('Account');
var departmentController = require("../../../controllers/department-controller");
var stationController = require("../../../controllers/station-controller");
var debug = require('debug')('fireServer:server');
var fakePlatoons = ["A", "B", "C"];
var ranks = [
    "A/C",
    "A/O",
    "B/C",
    "CI",
    "CII",
    "EMS",
    "DIVER",
    "EIT",
    "ENGR",
    "FF",
    "FFPM",
    "MATE",
    "MATE/P",
    "P2",
    "PIL1",
    "PIL1/P",
    "PIL2",
    "PIL2/P",
    "PIL3",
    "PIL3/P",
    "PIL4",
    "PIL4/P",
    "PIL5",
    "PIL5/P",
    "PILOT",
    "SUPR"
];

var getRandomRank = function(){
        return ranks[Math.floor(Math.random() * ranks.length)];
};

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
                platoon: getRandomPlatoon(),
                rank : getRandomRank(),
                photo: faker.image.avatar()
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
