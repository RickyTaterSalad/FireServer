var router = require('express').Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var passportHelper = require("../helpers/passport-helper");
const RequestHelperMethods = require("../util/request-helper-methods");
var debugHelper = require("../helpers/debug-helpers");


router.get('/', passportHelper.ensureAuthenticated, function (req, res) {
    if (req.user) {
        debugHelper.defaultDepartment().then(function (dept) {
            if (!dept || !dept._id) {
                return res.json(RequestHelperMethods.invalidRequestJson);
            }
            debugHelper.defaultStation().then(function (station) {
                if (!station || !station._id) {
                    return res.json(RequestHelperMethods.invalidRequestJson);
                }
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
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

module.exports = router;