var router = require('express').Router();
var mongoose = require('mongoose');
var Department = mongoose.model('Department');

router.get('/', function (req, res) {
    Department.find(function (err, department) {
        if (err) {
            res.send(err);
        } else {
            res.json(department);
        }
    });
});
router.post('/:departmentId/:stationId', function (req, res) {
    if (req.user) {
        Department.findByIdAndUpdate(req.params.departmentId, {
            $push: {"Stations": req.params.stationId}
        }, null, function (err, updateResult) {
            err ? res.json({success: false, message: err.message}) : res.json(updateResult);
        });
    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});

//todo lock down to admin only
router.post('/', function (req, res) {
    if (req.user) {
        Department.create(req.body, function (err, department) {
            if (err) {
                res.send(err);
            } else {
                res.json(department);
            }
        });
    }
    else {
        res.json({success: false, message: "Invalid request"});
    }
});

module.exports = router;