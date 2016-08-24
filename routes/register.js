var router = require('express').Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var passportHelper = require("../helpers/passport-helper");

var debugHelper = require("../helpers/debug-helpers");


router.get('/', passportHelper.ensureAuthenticated, function (req, res) {
    if (req.user) {
        debugHelper.defaultDepartment().then(function (dept) {
            debugHelper.defaultStation().then(function (station) {
                console.log("station: " + JSON.stringify(station));
                Account.findByIdAndUpdate(req.user._id, {
                    department: dept._id,
                    station: station._id
                }, null, function (err, updateResult) {
                    err ? res.json({success: false, message: err.message}) : res.json(updateResult);
                });
            });
        });
    }
    else {
        res.json({success: false, message: "not logged in"});
    }
});

module.exports = router;