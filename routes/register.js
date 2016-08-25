var router = require('express').Router();
var Account = require('mongoose').model('Account');
const RequestHelperMethods = require("../util/request-helper-methods");
var debugHelper = require("../helpers/debug-helpers");
const hasUser = require("../validators/has-user-validator").validate;

router.get('/', hasUser, function (req, res) {
    debugHelper.defaultDepartment().then(function (dept) {
        if (!dept || !dept._id) {
            return res.json(RequestHelperMethods.invalidRequestJson);
        }
        debugHelper.defaultStation().then(function (station) {
            if (!station || !station._id) {
                return res.json(RequestHelperMethods.invalidRequestJson);
            }
            Account.findByIdAndUpdate(req.user._id, {
                department: dept._id,
                station: station._id
            }, null, function (err, updateResult) {
                err ? res.json({success: false, message: err.message}) : res.json(updateResult);
            });
        });
    });
});

module.exports = router;