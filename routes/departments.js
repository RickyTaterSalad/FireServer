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

router.get('/:id', function (req, res) {
    if (req.params.id) {
        Department.findById(req.params.id, function (err, department) {
            if (err) {
                res.send(err);
            } else {
                res.json(department);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});

//todo lock down to admin only

router.post('/', function (req, res) {
    Department.create(req.body, function (err, department) {
        if (err) {
            res.send(err);
        } else {
            res.json(department);
        }
    });
});

module.exports = router;