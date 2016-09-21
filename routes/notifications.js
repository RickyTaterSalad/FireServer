var router = require('express').Router();
var dateUtils = require("../util/date-utils");
var moment = require("moment");
var notificationController = require("../controllers/notification-controller");
const hasUser = require("../validators/has-user-validator").validate;
router.get('/:timestamp', hasUser, function (req, res) {
    if (!req.params.timestamp) {
        return res.status(400).send();
    }
    var lastCheck;
    var timestampAsInt;
    try{
        timestampAsInt = parseInt(req.params.timestamp,10);
        lastCheck = dateUtils.dateFromMS(timestampAsInt);
    }
    catch(err){
        return res.status(400).send();
    }
    if (!lastCheck) {
        return res.json([]);
    }
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