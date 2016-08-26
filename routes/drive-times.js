var router = require('express').Router();
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;
var driveTimeController = require("../controllers/drive-time-controller");


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
        return res.json(RequestHelperMethods.invalidRequestJson);
    }).then(function (driveTime) {
        res.json(driveTime);
    });
});

module.exports = router;