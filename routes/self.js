var router = require('express').Router();
const hasUser = require("../validators/has-user-validator").validate;
var accountController = require("../controllers/account-controller");


var validateRegister = function (req, res, next) {
    if(!req.user || (req.user.assignHireCode && req.user.platoon && req.user.rank && req.user.station)){
        console.log("already registered");
        return res.status(400).send();
    }
    if (!req.body || !req.body.registration) {
        return res.status(400).send();
    }
    else if (!req.body.registration.rank || !req.body.registration.station || !req.body.registration.assignHireCode || !req.body.registration.platoon) {
        return res.status(400).send();
    }
    next();
}

router.get('/', hasUser, function (req, res) {
    res.json(req.user);
});
router.post('/', hasUser, validateRegister, function (req, res) {
    if (!req.body) {
        return res.status(400).send();
    }
    accountController.registerAccount(req.user.id, req.body.registration).then(
        function (updatedAccount) {
            if(!updatedAccount){
                return res.status(400).send();
            }
            return res.json(updatedAccount);
        })
});
module.exports = router;
