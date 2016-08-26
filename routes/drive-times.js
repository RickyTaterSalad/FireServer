var router = require('express').Router();
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
var driveTimeController = require("../controllers/drive-time-controller");
var debug = require('debug')('fireServer:server');

router.get('/:originStation/:destinationStation', hasUser, function (req, res) {
    var origin = req.params.originStation;
    var dest = req.params.destinationStation;
    if (origin == dest) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    if (!RequestHelperMethods.validObjectId(origin) || !RequestHelperMethods.validObjectId(dest)) {
        return res.json(RequestHelperMethods.invalidRequestJson);
    }
    driveTimeController.findByOriginStationAndDestination(origin, dest).catch(function (err) {
    }).then(function (driveTime) {
        return res.json(driveTime || {});
    });
});

module.exports = router;