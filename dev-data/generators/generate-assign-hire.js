var faker = require("faker");
var async = require("async");
var platoonGenerator = require('./generate-platoons');
var AssignHireCode = require('mongoose').model('AssignHireCode');


var generateAssignHires = function (count, callback) {
    var fxns = [];
    for (var i = 0; i < count; i++) {
        fxns.push(generateAssignHire.bind(null, Math.floor(Math.random() * 30) + 1));
    }
    fxns.push(function () {
        callback();
    });
    async.series(fxns);

};
var generateAssignHire = function (msgCount, callback) {
    var assignHire = new AssignHireCode({
        start: faker.date.future(),
        hours: 24,
        platoon: platoonGenerator.generatePlatoon()
    });

    var err = assignHire.validateSync();
    if (err) {
        console.log("generated invalid assign hire");
        callback();
    }
    else {
        console.log("created assign hire");
        assignHire.save(function (err) {
            if (err) {
                console.log("error creating assign hire");
                console.dir(err);
            }
            else {
                console.log("created assign hire");
            }
            callback();
        });
    }
};
module.exports = {
    generateAssignHires: generateAssignHires,
    generateAssignHire: generateAssignHire
};