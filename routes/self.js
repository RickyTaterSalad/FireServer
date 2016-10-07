var router = require('express').Router();
const hasUser = require("../validators/has-user-validator").validate;
var accountController = require("../controllers/account-controller");

router.get('/', hasUser, function (req, res) {
    res.json(req.user);
});

router.post('/', hasUser, function(req, res) {
    if (!req.body) {
        return res.status(400).send();
    }

    accountController.registerAccount(req.body).then(
        function(err, updatedAccount){
            if(err){
                console.log("error");
                //use different http different code?
                return res.status(400).send();
            }
            return res.json(updatedAccount);
        });
});

module.exports = router;
