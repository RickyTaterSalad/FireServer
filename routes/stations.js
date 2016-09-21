var router = require('express').Router();
var Station = require('mongoose').model('Station');
const hasUser = require("../validators/has-user-validator").validate;
router.get('/', function (req, res) {
    Station.find(function (err, stations) {
        if (err) {
            return res.status(400).send();
        }
        else {
            var ret = {};
            for (var i = 0; i < stations.length; i++) {
                ret[stations[i]._id] = stations[i];
            }
            return res.json(ret);
        }
    });
});
router.get('/:id', hasUser, function (req, res) {
    if (req.params && req.params.id) {
        Station.findById(req.params.id, function (err, station) {
            if (err) {
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