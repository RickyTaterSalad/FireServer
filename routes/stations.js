var router = require('express').Router();
var Station = require('mongoose').model('Station');
var stationController = require("../controllers/station-controller");

const hasUser = require("../validators/has-user-validator").validate;
router.get('/', function (req, res) {
    stationController.all(true).then(function(stations){
        if(stations){
            return res.json(stations);
        }
        else {
            return res.status(400).send();
        }
    });
});

router.get('/:id', hasUser, function (req, res) {
    if (req.params && req.params.id) {
        Station.findById(req.params.id, function (err, station) {
            if (err || !station) {
                return res.status(400).send();
            } else {
                res.json(station);
            }
        });
    }
    else {
        return res.status(400).send();
    }
});
module.exports = router;
