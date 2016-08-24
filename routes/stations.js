var router = require('express').Router();
var mongoose = require('mongoose');
var Station = mongoose.model('Station');
const RequestHelperMethods = require("../util/request-helper-methods");
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
    if (req.params && RequestHelperMethods.validObjectId((req.params.id))) {
        Station.findById(req.params.id, function (err, station) {
            if (err) {
                res.send(err);
            } else {
                res.json(station);
            }
        });
    }
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

//todo lock down to admin only

router.post('/', function (req, res) {
    if(req.user) {
        Station.create(req.body, function (err, station) {
            if (err) {
                res.send(err);
            } else {
                res.json(station);
            }
        });
    }
    else{
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

module.exports = router;