var router = require('express').Router();
var passport = require('passport');

var config = require('config');

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


router.get('/google',
    passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read']
        }
    ));
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        successRedirect: "/auth/success"
    }));

router.get('/success', function (req, res) {
    res.json(req.user);
});
router.get('/failure', function (req, res) {
    res.json({success: false, message: "login failed"});
});
module.exports = router;