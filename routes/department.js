var router = require('express').Router();
var Department = require('mongoose').model('Department');
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
router.get('/', hasUser, function (req, res) {
    Department.find(function (err, departments) {
        if (err) {
            res.send(err);
        } else {
            res.json(departments);
        }
    });
});
router.get('/:departmentId', hasUser, function (req, res) {
    if (req.params && RequestHelperMethods.validObjectId((req.params.departmentId))) {
        Department.findById(req.params.departmentId, function (err, department) {
            if (err) {
                res.send(err);
            } else {
                res.json(department);
            }
        });
    }
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});
router.post('/:departmentId/:stationId', hasUser, function (req, res) {
    Department.findByIdAndUpdate(req.params.departmentId, {
        $push: {"stations": req.params.stationId}
    }, null, function (err, updateResult) {
        err ? res.json({success: false, message: err.message}) : res.json(updateResult);
    });
});


module.exports = router;