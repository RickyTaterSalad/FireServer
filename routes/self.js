var router = require('express').Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var passportHelper = require("../helpers/passport-helper");

router.get('/', passportHelper.ensureAuthenticated, function (req, res) {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.json({});
    }
});

module.exports = router;