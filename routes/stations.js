var router = require('express').Router();
var mongoose = require('mongoose');
var Station = mongoose.model('Station');

router.get('/', function (req, res) {
    Station.find(function (err, department) {
        if (err) {
            res.send(err);
        } else {
            res.json(department);
        }
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id) {
        Station.findById(req.params.id, function (err, station) {
            if (err) {
                res.send(err);
            } else {
                res.json(station);
            }
        });
    }
    else {
        res.json({success: false, message: "No Id Passed"});
    }
});

//todo lock down to admin only

router.post('/', function (req, res) {
    Station.create(req.body, function (err, station) {
        if (err) {
            res.send(err);
        } else {
            res.json(station);
        }
    });
});

module.exports = router;