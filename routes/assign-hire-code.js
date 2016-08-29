var router = require('express').Router();
var debug = require('debug')('fireServer:server');
var mongoose = require('mongoose');
//var AssignHireCode = mongoose.model('AssignHireCode');
const AssignHireCodeController = require("../controllers/assign-hire-controller");
var RequestHelperMethods = require("../util/request-helper-methods");

router.get('/', function (req, res) {
    AssignHireCodeController
        .getAllAHCodes()
        .then(function(ahObj){
            if(ahObj){
                res.json(ahObj);
            }
            else {
                res.json({});
            }
        });
    // AssignHireCode.find(function (err, ahCodes) {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         res.json(ahCodes);
    //     }
    // });
});

router.get('/:ahCode', function (req, res) {
    debug(req.params);
    if(req.params && req.params.ahCode) {
        AssignHireCodeController
            .findByCode(req.params.ahCode.toUpperCase())
            .then(function(ahObj){
                if(ahObj){
                    res.json(ahObj);
                }
                else {
                    res.json({});
                }
            });
    }
    else{
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

module.exports = router;
