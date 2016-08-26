var router = require('express').Router();
var debug = require('debug')('fireServer:server');
var mongoose = require('mongoose');
var AssignHireCode = mongoose.model('AssignHireCode');
const RequestHelperMethods = require("../util/request-helper-methods");

router.get('/', function (req, res) {
    //TODO order by AH code ??
    AssignHireCode.find(function (err, ahCodes) {
        if (err) {
            res.send(err);
        } else {
            res.json(ahCodes);
        }
    });
});

router.get('/:ahCode', function (req, res) {
    if(req.params && req.params.ahCode) {
        AssignHireCode.
            find({ah_code : req.params.ahCode.toUpperCase()},
                function (err, ah) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(ah);
                    }
            });
    }
    else{
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

module.exports = router;
