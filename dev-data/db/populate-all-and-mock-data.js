var mongoose = require("mongoose");
var async = require('async');
//init mongoose
require("../../helpers/mongoose-helper").initialize();
var Account = mongoose.model('Account');
var departmentController = require("../../controllers/department-controller");
var stationController = require("../../controllers/station-controller");
var createFireUser = function (callback) {
    departmentController.getRandom().then(function (dept) {
        stationController.getRandom().then(function (station) {
            var account = new Account({
                localAuthUid: "fire",
                firstName: "fire",
                lastName: "fire",
                department: dept,
                station: station,
                email: "fire@fire.com"
            });
            var err = account.validateSync();
            if (err) {
                console.log("could not generate fire user ");
                callback();
            }
            else {
                console.log("saving  fire user");
                account.save(function (err) {
                    if (err) {
                        console.log("could not save fire user");
                    }
                    else {
                        console.log("saved fire user");
                        callback();

                    }
                });
            }
        });
    });
};
var run = function () {
    console.log("run");
    async.series([
        require("./tables/populate-department").createDepartment,
        require("./tables/populate-stations").createStations,
        createFireUser,
        require("./mock/generate-lots-of-data").createMockData
        //,  require("./tables/populate-drive-times").createDriveTimes
    ], function () {
        process.exit();
    });
};
module.exports = {
    run: run
};
run();