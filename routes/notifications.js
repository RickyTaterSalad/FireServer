var router = require('express').Router();
var dateUtils = require("../util/date-utils");
var moment = require("moment");
var notificationController = require("../controllers/notification-controller");
const hasUser = require("../validators/has-user-validator").validate;
router.get('/:timestamp', hasUser, function (req, res) {
    if (!req.params.timestamp) {
        return res.status(400).send("Bad Request");
    }
    console.dir(req.params.timestamp);
    var lastCheck;
    var timestampAsInt;
    try{
        timestampAsInt = parseInt(req.params.timestamp,10);
        lastCheck = dateUtils.dateFromMS(timestampAsInt);
        console.log("time: " + timestampAsInt);
        console.dir(lastCheck);
    }
    catch(err){
        console.dir(err);
        return res.status(400).send("Bad Request");
    }
    if (!lastCheck) {
        return res.json([]);
    }
    console.dir(lastCheck);
    notificationController.notificationsForUser(req.user,lastCheck).then(function(notifications){
        if(!res){
            return res.json([]);
        }
        else{
            return res.json(notifications);
        }
    })

});

module.exports = router;