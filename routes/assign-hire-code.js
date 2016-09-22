var router = require('express').Router();
var debug = require('debug')('fireServer:server');
var mongoose = require('mongoose');
const AssignHireCodeController = require("../controllers/assign-hire-controller");
const hasUser = require("../validators/has-user-validator").validate;

router.get('/', hasUser, function (req, res) {
    AssignHireCodeController
        .getAllAHCodes()
        .then(function (ahObj) {
            if (ahObj) {
                res.json(ahObj);
            }
            else {
                return res.status(400).send();
            }
        });
});

router.get('/:ahCode', hasUser, function (req, res) {
    debug(req.params);
    if (req.params && req.params.ahCode) {
        AssignHireCodeController
            .findByCode(req.params.ahCode.toUpperCase())
            .then(function (ahObj) {
                if (ahObj) {
                    res.json(ahObj);
                }
                else {
                    return res.status(400).send();
                }
            });
    }
    else {
        return res.status(400).send();
    }
});

router.get('/Date/:date', hasUser, function (req, res) {
    if (req.params && req.params.date) {
        AssignHireCodeController
            .findByDate(req.params.date)
            .then(function (ahObj) {
                if (ahObj) {
                    res.json(ahObj);
                }
                else {
                    return res.status(400).send();
                }
            });
    }
    else {
        return res.status(400).send();
    }
});

module.exports = router;
