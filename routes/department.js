var router = require('express').Router();
var mongoose = require('mongoose');
var Department = mongoose.model('Department');

router.get('/', function (req, res) {
    req.session.isLoggedIn = true;
    console.dir(req.session);
    Department.find(function (err, departments) {
        if (err) {
            res.send(err);
        } else {
            res.json(departments);
        }
    });
});

router.get('/:departmentId', function (req, res) {

    Department.findById(req.params.departmentId, function (err, department) {
        if (err) {
            res.send(err);
        } else {
            //  console.log("DEPT: " + JSON.stringify((department)));
            //  console.log(department.Stations[0].getTimestamp());
            res.json(department);
        }
    });
});
router.post('/:departmentId/:stationId', function (req, res) {
    if (req.user) {
        Department.findByIdAndUpdate(req.params.departmentId, {
            $push: {"stations": req.params.stationId}
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