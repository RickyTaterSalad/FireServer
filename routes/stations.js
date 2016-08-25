var router = require('express').Router();
var Station = require('mongoose').model('Station');
const hasUser = require("../validators/has-user-validator").validate;
const RequestHelperMethods = require("../util/request-helper-methods");
router.get('/', function (req, res) {
    Station.find(function (err, stations) {
        return err ? res.send(err) : res.json(stations);
    });
});
router.get('/:id', hasUser, function (req, res) {
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
module.exports = router;