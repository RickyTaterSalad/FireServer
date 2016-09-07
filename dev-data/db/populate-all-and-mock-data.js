var mongoose = require("mongoose");
var async = require('async');
var faker = require("faker");
var debug = require('debug')('fireServer:server');
//init mongoose
require("../../helpers/mongoose-helper").initialize();
var Account = mongoose.model('Account');
var departmentController = require("../../controllers/department-controller");
var stationController = require("../../controllers/station-controller");

var fakePlatoons = ["A", "B", "C"];
var getRandomPlatoon = function () {
    return fakePlatoons[Math.floor(Math.random() * fakePlatoons.length)];
};

var createFireUser = function (callback) {
    departmentController.getRandom().then(function (dept) {
        stationController.getRandom().then(function (station) {
            var account = new Account({
                localAuthUid: "fire",
                photo: faker.image.avatar(),
                firstName: "Mammone ",
                lastName: "Rivera",
                department: dept,
                station: station,
                email: "fire@fire.com",
                platoon: getRandomPlatoon()
            });
            var err = account.validateSync();
            if (err) {
                debug("could not generate fire user ");
                console.dir(err);
                callback();
            }
            else {
                debug("saving  fire user");
                account.save(function (err) {
                    if (err) {
                        debug("could not save fire user");
                    }
                    else {
                        debug("saved fire user");
                        callback();

                    }
                });
            }
        });
    });
};
var run = function () {
    debug("run");
    async.series([
        require("./tables/populate-department").createDepartment,
        require("./tables/populate-stations").createStations,
        require("./tables/populate-ah").generateAH,
        createFireUser,
        require("./mock/generate-lots-of-data").createMockData,
        require("./tables/populate-drive-times").createDriveTimes
    ], function () {
        process.exit();
    });
};
module.exports = {
    run: run
};
run();