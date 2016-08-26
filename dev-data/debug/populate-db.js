var mongoose = require("mongoose");
var async = require('async');
//init mongoose
require("../../helpers/mongoose-helper").initialize();
var Department = mongoose.model('Department');
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
var createDepartment = function (callback) {
    console.log("Create dept");
    var dept = new Department({
        name: "LAFD",
        platoons: [
            "A",
            "B",
            "C"
        ],
        schedule: {
            name: "Schedule Name",
            numberOfPlatoons: 3,
            platoonSchedule: "A,C,A,B,A,B,C,B,C",
            shiftLengthInHours: 24,
            shiftStartTime: "0800"
        }
    });
    var err = dept.validateSync();
    if (err) {
        console.log("generated invalid message");
        callback();
    }
    else {
        dept.save(callback);
    }
};
var run = function () {
    console.log("run");
    async.series([
        createDepartment,
        require("./populate-stations").createStations,
        createFireUser,
        require("../mock-data-generation-scripts/generate-lots-of-data").createMockData
        //, require("./populate-drive-times").createDriveTimes
    ], function () {
        process.exit();
    });
};
module.exports = {
    run: run
};
run();