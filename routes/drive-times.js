var router = require('express').Router();
const hasUser = require("../validators/has-user-validator").validate;
var driveTimeController = require("../controllers/drive-time-controller");
var debug = require('debug')('fireServer:server');

router.get('/:originStation/:destinationStation', hasUser, function (req, res) {
    var origin = req.params.originStation;
    var dest = req.params.destinationStation;
    if(!origin || !dest){
        return res.status(400).send();
    }
    if (origin == dest) {
        return res.status(400).send("Origin Same As Destination");
    }
    driveTimeController.findByOriginStationAndDestination(origin, dest).catch(function (err) {
    }).then(function (driveTime) {
        return res.json(driveTime || {});
    });
});

module.exports = router;