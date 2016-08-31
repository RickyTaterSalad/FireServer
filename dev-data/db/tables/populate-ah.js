var mongoose = require("mongoose");
var async = require('async');
var debug = require('debug')('fireServer:server');
var faker = require("faker");
var moment = require("moment");
//init mongoose
//require("../../helpers/mongoose-helper").initialize();

var AssignHireCode = mongoose.model('AssignHireCode');
//var Shift = mongoose.model('Shift');
var Department = mongoose.model('Department');


var debugCount = 300;

var fakePlatoons = ["A", "B", "C"];

var fakeAhCodes = ["CO6", "C07", "C08", "A01", "A02", "B01", "B02", "B03"]

var getRandomPlatoon = function () {
    return fakePlatoons[Math.floor(Math.random() * fakePlatoons.length)];
};
var _generateAH = function (dept, callback) {
    var fxns = [];
    for (var i = 0; i < fakeAhCodes.length; i++) {
        var ahCode = new AssignHireCode({
            ahCode: fakeAhCodes[i],
            department: dept._id,
            shifts: []
        });
        for (var j = 0; j < debugCount; j++) {
            var futureDate = faker.date.future();
            var futureMoment = moment(futureDate).utc();
            futureMoment.minute(0);
            futureMoment.second(0);
            futureMoment.millisecond(0);
            futureMoment.hour(0);
            ahCode.shifts.push({
                hours: 24,
                platoon: getRandomPlatoon(),
                start: futureMoment
            });
        }
        fxns.push(ahCode.save.bind(this, ahCode));
    }
    async.series(fxns, callback);
};


var generateAH = function (callback) {
    debug('Generating AH Codes ...');

    async.waterfall([
            //get LAFD department
            function (callback) {
                Department
                    .findOne({'name': 'LAFD'})
                    .select('_id')
                    .exec(callback);
            },
            _generateAH
        ],
        //callback function to handle end of waterfall execution
        callback
    );
};
module.exports = {
    generateAH: generateAH
};
