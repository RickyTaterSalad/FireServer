var mongoose = require("mongoose");
var async = require('async');

//init mongoose
//require("../../helpers/mongoose-helper").initialize();

var AssignHireCode = mongoose.model('AssignHireCode');
//var Shift = mongoose.model('Shift');
var Department = mongoose.model('Department');

var username = "fire";
var password = "fire";

var generateAH = function () {
    console.log('Generating AH Codes ...');

    async.waterfall([
            //get LAFD department
            function (callback) {
                Department
                    .findOne({'Name': 'LAFD'})
                    .select('_id')
                    .exec(callback);
                //console.log('Got LAFD, ID:' + dept._id);
                //callback(null, dept);
            },
            //insert AH code object
            function (dept, callback) {
                //build assign hire code Object
                var ahCode = new AssignHireCode({
                    "ah_code": "C06",
                    "department": dept._id,
                    "shifts": [
                        {
                            "start": new Date(2016, 8, 11, 8),
                            "hours": 24,
                            "platoon": "A"
                        },
                        {
                            "start": new Date(2016, 9, 7, 8),
                            "hours": 24,
                            "platoon": "B"
                        },
                        {
                            "start": new Date(2016, 9, 17, 8),
                            "hours": 24,
                            "platoon": "A"
                        },
                        {
                            "start": new Date(2016, 10, 12, 8),
                            "hours": 24,
                            "platoon": "B"
                        },
                        {
                            "start": new Date(2016, 10, 29, 8),
                            "hours": 24,
                            "platoon": "A"
                        },
                        {
                            "start": new Date(2016, 11, 17, 8),
                            "hours": 24,
                            "platoon": "A"
                        }
                    ]
                });
                ahCode.save(function (err) {
                    if (err) return callback(err, null);
                    return callback(null, "done");
                });
            }],
        //callback function to handle end of waterfall execution
        function (err, result) {
            if (err) {
                console.log("Error!");
            } else {
                console.log("Success!");
            }
        }
    );
}
generateAH();
return;
