var router = require('express').Router();
var passport = require('passport');
var debug = require('debug')('fireServer:server');
var config = require('config');
var jwtUtil = require("../util/jwt_util");
var accountController = require("../controllers/account-controller");

router.get("/generateToken", function (req, res) {
    accountController.getFireUser().then(function (user) {
        return res.json({user: user, token: jwtUtil.generateToken((user))});
    })
});
router.post("/decodeToken", function (req, res) {
    if (!req.body || !req.body.token) {
        return res.status(400).send();
    }
    try {
        return res.json(jwtUtil.decode((req.body.token)));
    }
    catch (err) {
        debug(err);
        return res.status(400).send();
    }
});

router.get("/isLoggedIn", function (req, res) {
    res.json({isLoggedIn: req.isAuthenticated()});
});
router.get("/logOut", function (req, res) {
    if (req.isAuthenticated()) {
        req.logout();
        res.json({success: true});
    }
    else {
        res.json({success: false, message: "not logged in"});
    }
});
router.post("/google", function (req, res) {
    return passport.authenticate('google-idtoken')(req, res, function (error) {
        debug("got response");
        if (error) {
            return res.json({success: false, message: "login failed"});
        }
        return res.json({user: req.user, token: jwtUtil.generateToken(req.user)});
    });
});
module.exports = router;