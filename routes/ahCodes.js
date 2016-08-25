var router = require('express').Router();
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
    console.log('AH Code: ' + req.params.ahCode);
    if(req.params && req.params.ahCode) {
        AssignHireCode.
            find({ah_code : req.params.ahCode.toUpperCase()},
                function (err, ah) {
                    if (err) {
                        res.send(err);
                    } else {
                        //  console.log("DEPT: " + JSON.stringify((department)));
                        //  console.log(department.Stations[0].getTimestamp());
                        res.json(ah);
                    }
            });
    }
    else{
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});

module.exports = router;
